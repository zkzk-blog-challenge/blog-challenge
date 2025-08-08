<template>
  <div v-for="group in grouped" :key="group.key">
    <h1 class="year">{{ group.label }}</h1>

    <div class="weeks">
      <div class="week" v-for="w in group.weeks" :key="w.weekNum">
        <h2 class="week-title">{{ w.weekNum }}주차</h2>

        <a
          :href="withBase(article.regularPath)"
          v-for="(article, index) in w.items"
          :key="index"
          class="posts"
        >
          <div class="post-container">
            <div class="post-dot"></div>
            {{ article.frontMatter.title }}
            <!-- 🔹 태그 표시 -->
            <span
              v-for="(tag, tIndex) in article.frontMatter.tags || []"
              :key="tIndex"
              class="tag-label"
            >
              {{ tag }}
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

// 날짜: "2025년 01기 03주차" → { year: 2025, quarter: 1, week: 3 }
function parseYQW(dateStr: string) {
  const m = dateStr.match(/(\d{4})년\s*(\d{1,2})기\s*(\d{1,2})주차/)
  if (!m) return null
  const [, y, q, w] = m
  return { year: Number(y), quarter: Number(q), week: Number(w) }
}

const { theme } = useData()

const grouped = computed(() => {
  const posts = theme.value.posts || []
  const map = new Map<string, { label: string; weeks: Map<number, any[]> }>()
  for (const p of posts) {
    const info = parseYQW(p.frontMatter.date)
    if (!info) continue
    const key = `${info.year}-${info.quarter}` // key에 그대로 저장
    if (!map.has(key)) {
      map.set(key, {
        label: `${info.year}년 ${info.quarter}기`, // 앞 0 없이 표시
        weeks: new Map<number, any[]>()
      })
    }
    const g = map.get(key)!
    if (!g.weeks.has(info.week)) g.weeks.set(info.week, [])
    g.weeks.get(info.week)!.push(p)
  }

  const groups = Array.from(map.entries())
    .sort((a, b) => {
      const [ay, aq] = a[0].split('-').map(Number)
      const [by, bq] = b[0].split('-').map(Number)
      if (by !== ay) return by - ay
      return bq - aq
    })
    .map(([key, val]) => {
      const weeks = Array.from(val.weeks.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([weekNum, items]) => ({
          weekNum,
          items
        }))
      return { key, label: val.label, weeks }
    })

  return groups
})
</script>

<style scoped>

.year {
  padding: 28px 0 10px 0;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--bt-theme-title);
  font-family: var(--date-font-family), serif;
}

.week-title {
  margin: 8px 0 6px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--bt-theme-title);
}

/* 태그 스타일 */
.tag-label {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  font-size: 0.75rem;
  background-color: var(--bt-theme-bg, #f0f0f0);
  color: var(--bt-theme-title);
  border-radius: 4px;
  white-space: nowrap;
}
</style>