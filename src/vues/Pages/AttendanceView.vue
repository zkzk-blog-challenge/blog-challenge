<template>
  <!-- 출석 현황 리스트 -->
  <v-row class="justify-space-between | align-center | no-gutters | ma-6" >
    <v-col>
      <v-row class="justify-start | align-center | no-gutters | title-text">
        제출 현황
      </v-row>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-container class="pa-0">
    <v-row
      v-for="item in formattedRows"
      :key="item.name"
      class="mb-3 align-center"
    >
      <!-- 이름 + 블로그 -->
      <v-col cols="2" class="d-flex align-center gap-2">
        <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
        <v-btn
          v-if="item.blog"
          :href="item.blog"
          icon
          size="small"
          target="_blank"
          rel="noopener"
          variant="text"
        >
          <v-icon size="18">mdi-link-variant</v-icon>
        </v-btn>
      </v-col>

      <!-- 잔디 칸 + 제출 통계 -->
      <v-col cols="10" class="d-flex align-center gap-2">
        <div class="d-flex flex-wrap gap-1">
          <v-tooltip
            v-for="(cell, i) in item.cells"
            :key="i"
            location="top"
          >
            <template #activator="{ props }">
              <!-- 상태별 조건 분기 -->
              <v-chip
                v-if="cell.status === '제출'"
                class="check-dot"
                color="#5932EA" variant="flat"
                v-bind="props"
              />
              <v-chip
                v-else-if="cell.status === '지각'"
                class="check-dot"
                color="#FFA3CF" variant="flat"
                v-bind="props"
              />
              <v-chip
                v-else
                class="check-dot"
                color="#F2EFFF" variant="flat"
                v-bind="props"
              />
            </template>
            <span>주차 {{ cell.week }}<br>상태: {{ cell.status }}</span>
          </v-tooltip>
        </div>

        <!-- 제출 수 / 전체 -->
        <span class="text-caption text-grey">
          {{ item.cells.filter(c => c.status === '제출').length }} / {{ item.cells.length }}
        </span>
      </v-col>
    </v-row>
  </v-container>

  <!-- 범례 -->
  <v-divider class="my-4" />
  <div class="d-flex align-center gap-4 text-caption text-grey">
    <div class="d-flex align-center gap-1">
      <v-chip size="x-small" color="#5932EA" style="width: 14px; height: 14px;" class="pa-0" />
      <span>제출</span>
    </div>
    <div class="d-flex align-center gap-1">
      <v-chip size="x-small" color="#FFA3CF" style="width: 14px; height: 14px;" class="pa-0" />
      <span>지각</span>
    </div>
    <div class="d-flex align-center gap-1">
      <v-chip size="x-small" color="#F2EFFF" style="width: 14px; height: 14px;" class="pa-0" />
      <span>미제출</span>
    </div>
  </div>
</template>


<script setup>
// ----- 선언부 ----- //
import { onMounted, ref, computed } from 'vue'


// const indexData = ref({ participants: [], weeks: [], submissions: {} })
// const submissions = ref([])

// ✅ 목데이터: 참가자 + 주차 + 경로
const indexData = ref({
  participants: [
    { name: '고예경', blog: 'https://zak2lab.tistory.com/' },
    { name: '김영지', blog: 'https://blog.naver.com/0g_lab' },
    { name: '우영인', blog: 'https://blog.naver.com/younging2004' },
    { name: '조은비', blog: '' }
  ],
  weeks: ['2025-C1-W1', '2025-C1-W2'],
  submissions: {
    '고예경': {
      '2025-C1-W1': 'mock',
      '2025-C1-W2': 'mock'
    },
    '김영지': {
      '2025-C1-W1': 'mock'
    },
    '우영인': {
      '2025-C1-W1': 'mock',
      '2025-C1-W2': 'mock'
    },
    '조은비': {
      '2025-C1-W2': 'mock'
    }
  }
})

// ✅ 목데이터: 실제 제출 정보
const submissions = ref([
  {
    name: '고예경',
    week: '2025-C1-W1',
    submittedAt: '2025-07-14T11:00:00.000Z',
    due: '2025-07-15T23:59:59.000Z'
  },
  {
    name: '고예경',
    week: '2025-C1-W2',
    submittedAt: '2025-07-17T01:00:00.000Z',
    due: '2025-07-16T23:59:59.000Z'
  },
  {
    name: '김영지',
    week: '2025-C1-W1',
    submittedAt: '2025-07-15T10:30:00.000Z',
    due: '2025-07-15T23:59:59.000Z'
  },
  {
    name: '우영인',
    week: '2025-C1-W1',
    submittedAt: '2025-07-13T09:30:00.000Z',
    due: '2025-07-15T23:59:59.000Z'
  },
  {
    name: '우영인',
    week: '2025-C1-W2',
    submittedAt: '2025-07-18T01:30:00.000Z',
    due: '2025-07-16T23:59:59.000Z'
  },
  {
    name: '조은비',
    week: '2025-C1-W2',
    submittedAt: '2025-07-16T22:00:00.000Z',
    due: '2025-07-16T23:59:59.000Z'
  }
])

const formattedRows = computed(() => {
  return indexData.value.participants.map(p =>
    typeof p === 'string' ? { name: p, blog: '' } : p
  ).map(user => {
    const name = user.name
    const blog = user.blog
    const cells = indexData.value.weeks.map(week => {
      const path = indexData.value.submissions?.[name]?.[week]
      if (!path) return { week, status: '미제출' }

      const entry = submissions.value.find(s => s.name === name && s.week === week)
      const status = getSubmissionStatus(entry || {})
      return { week, status }
    })
    return { name, blog, cells }
  })
})

const headers = [
  { title: '이름', key: 'name' },
  { title: '출석', key: 'cells' }  // ← 여기 key를 'cells'로!
]

// ----- 라이프 사이클 ----- //
onMounted(async () => {
  const res = await fetch('/submissions/index.json')
  const json = await res.json()
  indexData.value = json

  // === 여기가 핵심 ===
  const fetched = []
  for (const p of json.participants) {
    const name = typeof p === 'string' ? p : p.name
    for (const week of json.weeks) {
      const path = json.submissions?.[name]?.[week]
      if (path) {
        try {
          const entry = await fetch(path).then(r => r.json())
          fetched.push(entry)
        } catch (e) {
          console.warn(`❗ ${name} / ${week} 로딩 실패`, e)
        }
      }
    }
  }
  submissions.value = fetched
})
// ----- 함수 정의 ----- //

function getStatusClass(status) {
  switch (status) {
    case '제출':
      return 'submitted'
    case '지각':
      return 'late'
    case '결석':
    case '미제출':
    default:
      return 'missed'
  }
}

function getSubmissionStatus(submission) {
  if (!submission.submittedAt) return '미제출'

  const submitted = new Date(submission.submittedAt)
  const due = submission.due ? new Date(submission.due) : new Date(submission.week) // fallback

  return submitted > due ? '지각' : '제출'
}

</script>

<style scoped>
.title-text {
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.check-dot {
  width: 20px; min-width: 20px; max-width: 20px;
  height: 20px; min-height: 20px; max-height: 20px;
  border-radius: 8px;
}

.submitted {
  background-color: #5932EA; /* green */
}
.late {
  background-color: #FFA3CF; /* yellow */
}
.missed {
  background-color: #F2EFFF; /* gray */
}

</style>
