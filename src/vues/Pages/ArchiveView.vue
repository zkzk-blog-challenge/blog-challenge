<template>
  <!-- 필터 선택 -->
  <v-row class="justify-space-between | align-center | no-gutters | ma-6" >
    <v-col>
      <v-row class="justify-start | align-center | no-gutters | title-text">
        제출 목록
      </v-row>
    </v-col>
    
    <v-col class="pa-0 | pr-2 | width-136">
      <v-select
        variant="outlined" rounded="lg" bg-color="#F9FBFF" base-color="#7E7E7E" color="#7E7E7E" item-color="#7E7E7E" density="compact"
        v-model="selectedUser"
        :items="indexData.participants"
        item-title="name"
        item-value="name"
        placeholder="사용자 선택"
        clearable hide-details
      />
    </v-col>
    <v-col class="pa-0 | pr-2 | width-136">
      <v-select
        variant="outlined" rounded="lg" bg-color="#F9FBFF" base-color="#7E7E7E" color="#7E7E7E" item-color="#7E7E7E" density="compact"
        v-model="selectedWeek"
        :items="indexData.weeks"
        placeholder="주차 선택"
        clearable hide-details
      />
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <!-- 카드 목록 (일렬 수직 정렬) -->
  <v-container>
    <v-card
      v-for="user in filteredUsers"
      :key="user.name"
      class="mb-3"
      variant="outlined"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-medium">{{ user.name }}</span>
        <template>
          <div class="d-flex align-center gap-2">
            <span class="text-caption">
              {{ getSubmissionStatus(getSubmission(user.name)) }}
            </span>
            <a  v-if="getSubmission(user.name)"
              :href="getSubmission(user.name).link"
              target="_blank"
              class="text-blue text-decoration-none text-caption"
            >🔗 제출</a>
          </div>
        </template>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, ref, computed, watch } from "vue";
import { SubmissionManager } from "@/scripts/SubmissionManager";

// 매니저 인스턴스
// ----- 목업 매니저 정의 ----- //
const manager = {
  participants: [
    '고예경',
    '김영지',
    '우영인',
    '조은비'
  ],

  async init() {
    // 실제 서버 연동 대신 participants만 설정
    return Promise.resolve();
  },

  async loadWeekSubmissions(week) {
    const MOCK_SUBMISSIONS = {
      "2025-C1-W1": [
        { name: "고예경", status: 1, submittedAt: "2025-07-15T09:00:00Z", link: "https://blog.com/1" },
        { name: "김영지", status: 2, submittedAt: "2025-07-16T10:00:00Z" },
        { name: "우영인", status: 0 },
        { name: "조은비", status: 1, submittedAt: "2025-07-15T08:30:00Z" }
      ],
      "2025-C1-W2": [
        { name: "고예경", status: 2, submittedAt: "2025-07-23T00:30:00Z" },
        { name: "김영지", status: 1, submittedAt: "2025-07-22T15:20:00Z" },
        { name: "우영인", status: 1, submittedAt: "2025-07-22T10:10:00Z" },
        { name: "조은비", status: 0 }
      ],
      "2025-C1-W3": [
        { name: "고예경", status: 1, submittedAt: "2025-07-29T14:00:00Z" },
        { name: "김영지", status: 0 },
        { name: "우영인", status: 1, submittedAt: "2025-07-29T13:50:00Z" },
        { name: "조은비", status: 2, submittedAt: "2025-07-30T00:10:00Z", link: "https://blog.com/late" }
      ]
    }

    return Promise.resolve(MOCK_SUBMISSIONS[week] || []);
  }
};

// 상태
const indexData = ref({
  participants: [],
  weeks: ["2025-C1-W1", "2025-C1-W2", "2025-C1-W3"], // 필요 시 자동 생성 or 외부 import
});
const selectedUser = ref(null);
const selectedWeek = ref(null);
const allSubmissions = ref([]);

// 상태 코드 라벨
const STATUS_LABEL = ["❌ 미제출", "✅ 제출", "⚠️ 지각"];


// ----- 라이프 사이클 ----- //

onMounted(async () => {
  await manager.init();
  indexData.value.participants = manager.participants;
  console.log("[ArchiveView] 참가자 로딩 완료");

  if (indexData.value.weeks.length > 0) {
    selectedWeek.value = indexData.value.weeks.at(-1); // 가장 최신 주차 선택
  }
});

// 주차 선택 시 데이터 로딩
watch(selectedWeek, async (newWeek) => {
  if (!newWeek) return;
  console.log("[ArchiveView] 주차 변경:", newWeek);

  const result = await manager.loadWeekSubmissions(newWeek);
  allSubmissions.value = result;

  console.log(`[ArchiveView] ${newWeek} 제출현황 ↓`);
  result.forEach((entry) => {
    console.log({
      name: entry.name,
      status: entry.status,
      link: entry.link || null,
      submittedAt: entry.submittedAt || null,
    });
  });
});


// ----- 함수 정의 ----- //

// 유저 필터링
const filteredUsers = computed(() => {
  return allSubmissions.value.filter((item) => {
    return selectedUser.value ? item.name === selectedUser.value : true;
  });
});

// 유저 제출 정보 가져오기
function getSubmission(name) {
  return allSubmissions.value.find((item) => item.name === name);
}

// 상태 라벨 반환
function getSubmissionStatus(sub) {
  return sub ? STATUS_LABEL[sub.status] : "❌ 미제출";
}

</script>

<style scoped>
.width-136 {
  width: 136px;
}

.title-text {
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
</style>