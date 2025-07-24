<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    class="elevation-1"
    item-value="name"
    :items-per-page="20"
  >
    <template #item.link="{ item }">
      <a :href="item.link" target="_blank">🔗 링크</a>
    </template>
    <template #item.submittedAt="{ item }">
      {{ item.submittedAt || '제출일 없음' }}
    </template>
  </v-data-table>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";

const headers = [
  { title: '이름', key: 'name' },
  { title: '주차', key: 'week' },
  { title: '제출 링크', key: 'link' },
  { title: '제출일', key: 'submittedAt' },
]

const submissions = ref([])

// ----- 라이프 사이클 ----- //
onMounted(async () => {
    const index = await fetch('./submissions/index.json').then(res => res.json())
    const all = await Promise.all(index.map(path =>
        fetch(path).then(r => r.json())
    ))
    submissions.value = all
})

onUnmounted(() => {

})

// ----- 함수 정의 ----- //


</script>

<style scoped>

</style>