<template>
  <v-row class="justify-center | align-center | pa-6" no-gutters>
    <!-- 제출률 -->
    <v-col cols="3" class="d-flex | align-center">
      <v-icon size="32" color="#00AC4F" class="mr-4 | icon-box | color-green">mdi-chart-line</v-icon>
      <v-col>
        <v-row class="no-gutters | text-caption | text-grey">총 참여자</v-row>
        <v-row class="no-gutters | text-notice">{{ submissionRateDisplay }}명</v-row>
      </v-col>
    </v-col>

    <v-col cols="1" class="d-flex | justify-center">
      <v-divider vertical style="height: 72px" />
    </v-col>


    <!-- 총 참여자 수 -->
    <v-col cols="3" class="d-flex | align-center">
      <v-icon size="32" color="#0F5FC2" class="mr-4 | icon-box | color-blue">mdi-account-group</v-icon>
      <v-col>
        <v-row class="no-gutters | text-caption | text-grey">이번주 출석</v-row>
        <v-row class="no-gutters | text-notice">{{ totalParticipants }}명</v-row>
      </v-col>
    </v-col>

    <v-col cols="1" class="d-flex | justify-center">
      <v-divider vertical style="height: 72px" />
    </v-col>

    <!-- 이번 주 제출자 수 -->
    <v-col cols="3" class="d-flex | align-center">
      <v-icon size="32" color="#DA001A" class="mr-4 | icon-box | color-red">mdi-calendar-check</v-icon>
      <v-col>
        <v-row class="no-gutters | text-caption | text-grey">제출률</v-row>
        <v-row class="no-gutters | text-notice">{{ thisWeekSubmitCountDisplay }}%</v-row>
      </v-col>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  indexData: {
    type: Object,
    required: true
  },
  submissions: {
    type: Array,
    required: true
  }
})

// 총 참여자 수
const totalParticipants = computed(() => props.indexData?.participants?.length || 0)

// 전체 제출 수 및 가능 제출 수
const totalSubmissions = computed(() => props.submissions?.length || 0)
const maxSubmissions = computed(() =>
  (props.indexData?.participants?.length || 0) * (props.indexData?.weeks?.length || 0)
)
const submissionRate = computed(() =>
  maxSubmissions.value > 0
    ? Math.round((totalSubmissions.value / maxSubmissions.value) * 100)
    : null
)
const submissionRateDisplay = computed(() =>
  submissionRate.value !== null ? `${submissionRate.value}%` : '-'
)

// 현재 주차 (마지막 주차)
const currentWeek = computed(() => {
  const weeks = props.indexData?.weeks || []
  return weeks.length > 0 ? weeks[weeks.length - 1] : null
})
const currentWeekDisplay = computed(() => currentWeek.value || '-')

// 이번 주 제출자 수
const thisWeekSubmitCount = computed(() => {
  if (!currentWeek.value) return null
  return props.submissions.filter(s => s.week === currentWeek.value).length
})
const thisWeekSubmitCountDisplay = computed(() =>
  thisWeekSubmitCount.value !== null ? thisWeekSubmitCount.value : '-'
)
</script>

<style>
.text-notice {
  color: #333;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.32px;
}

.icon-box {
  width: 72px; min-width: 72px; max-width: 72px;
  height: 72px; min-height: 72px; max-height: 72px;
  border-radius: 100%;
  justify-content: center;
  align-items: center;
}

.color-green {
  background-color: #D3FFE7;
}

.color-red {
  background-color: #FFD4F3;
}

.color-blue {
  background-color: #CDF4FF;
}

.divider-margin {
  margin-left: 72px;
  margin-right: 72px;
}
</style>