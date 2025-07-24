<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-4">챌린지 규칙</h2>
    <div v-html="renderedMarkdown" class="markdown-body" />
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { ref, onMounted } from 'vue'
import { marked } from 'marked'  // 설치 필요

const markdownText = ref('')
const renderedMarkdown = ref('')

// ----- 라이프 사이클 ----- //
onMounted(async () => {
  try {
    const res = await fetch('/rules.md')
    markdownText.value = await res.text()
    renderedMarkdown.value = marked.parse(markdownText.value)
  } catch (e) {
    renderedMarkdown.value = '<p>📛 규칙 파일을 불러올 수 없습니다.</p>'
  }
})
</script>

<style scoped>
.markdown-body {
  line-height: 1.7;
}
.markdown-body h1, .markdown-body h2 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.markdown-body ul {
  padding-left: 1.2rem;
}
</style>