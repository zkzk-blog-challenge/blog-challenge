<!-- 예제 페이지 -->

<template>
  <BoxContainer>
    <SubTitle :title="title" :desc="desc"> </SubTitle>

    <v-row no-gutters justify="start">
      <v-label>소음은 어디까지 허용하나요?</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-3">
      <v-slider
        :max="4" :step="1"
        v-model="noise"
        color="#FF5858" thumb-color="#FF5858" track-color="#D9D9D9" track-fill-color="#FF5858" 
        tick-size="4" show-ticks="always" track-size="4" thumb-size="16" hide-details
      ></v-slider>
    </v-row>
    <v-row no-gutters class="justify-space-between | pt-2">
      <v-label class="small-label">항상 이어폰</v-label>
      <v-label class="small-label">작은소리 허용</v-label>
      <v-label class="small-label">스피커 모드</v-label>
    </v-row>

    <v-row no-gutters justify="start">
      <v-label>기숙사를 선택해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-select
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#FF5858" color="#FF5858" item-color="#FF5858" 
        :items="dormItem"
        placeholder="기숙사"
        v-model="dorm" 
      ></v-select>
    </v-row>

    <v-row no-gutters justify="start">
      <v-label v-html="'해당하는 것이 있다면 선택해주세요<br>(최대5개)'"></v-label>
    </v-row>
    <v-row no-gutters justify="start" class="mt-4">
      <v-col>
        <v-chip
          v-for="(tag, index) in tagItem"
          :key="index"
          :class="{'v-chip--selected': selectTag.includes(tag.value)}"
          class="custom-chip | mb-2 | mr-2 | pr-3 | pl-3"
          :style="{ backgroundColor: 'white' }"
          :color="selectTag.includes(tag.value) ? '#FF5858' : '#B1B1B1'"
          variant="outlined"
          @click="handleClickTag(tag.value)"
        >
          {{ tag.title }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row no-gutters justify="start" class="margin-top-52">
      <v-label>더 하고 싶은 말이 있다면 작성해주세요</v-label>
    </v-row>
    <v-row no-gutters justify="center" class="mt-1">
      <v-text-field
        variant="outlined" rounded="lg" bg-color="#FFFFFF" base-color="#CCCCCC" color="#CCCCCC" item-color="#CCCCCC" 
        placeholder="태그 설명 등을 작성해주세요"
        v-model="notes"
        maxlength="100"
      >
        <template v-slot:append-inner>
          <v-label class="count-label" :text="`${notes.length}/100`"></v-label>
        </template>

      </v-text-field>
    </v-row>

  </BoxContainer>
</template>


<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"
import BoxContainer from "@/components/BoxContainer.vue";

const title = '일상생활';
const desc ='사소하지만 빼먹을 수 없는 몇 가지만 마지막으로 확인해 볼게요.'

const noise = ref(0);    
const share = ref(0);         
const home = ref(0);

const dorm = ref(null);          // 기숙사
const dormItem = ref([
  { title: '예지 1동', value: '예지 1동'},
  { title: '예지 2동', value: '예지 2동'},
  { title: '예지 3동', value: '예지 3동'},
  { title: '명덕 1동', value: '명덕 1동'},
  { title: '명덕 2동', value: '명덕 2동'},
  { title: '명덕 3동', value: '명덕 3동'},
  // { title: '글로벌 하우스', value: 20},
  // { title: '308 블루미르홀', value: 21},
  // { title: '309 블루미르홀', value: 22},
  // { title: '퓨처하우스', value: 23}
])

const selectTag = ref([])
const tagItem = ref([
  { title: '매트선호', value: '매트선호'},
  { title: '룸메와 거리두기 필요', value: '룸메와 거리두기 필요'},
  { title: '취준/자격증', value: '취준/자격증'},
  { title: '고요를 즐김', value: '고요를 즐김'},
  { title: '배달음식러버', value: '배달음식러버'},
  { title: '잦은 밤샘', value: '잦은 밤샘'},
  { title: '끝없는과제', value: '끝없는과제'},
  { title: '길거나 잦은 통화', value: '길거나 잦은 통화'},
  { title: '환기 자주 필요', value: '환기 자주 필요'},
  { title: '방에 자주 비움', value: '방을 자주 비움'},
  { title: '추위 많이 탐', value: '추위 많이 탐'},
  { title: '더위 많이 탐', value: '더위 많이 탐'},
  { title: '짐이 많음', value: '짐이 많음'},
  { title: '잠귀 밝음', value: '잠귀 밝음'},
])

const notes = ref('')

// ----- 라이프 사이클 ----- //
onMounted(() => {
  setCurrentSurvey()
});

onUnmounted(() => {

})

// 변경값 확인 및 업데이트
watch(noise, (newValue, oldValue) => {
  console.log(`--- noise changed from ${oldValue} to ${newValue}`);
  updateLocalStorage("noise", newValue);
});

// ----- 함수 정의 ----- //

// 최초 로딩
function setCurrentSurvey() {
  localStorage.setItem('userProgress', JSON.stringify({ currentStep: 6}));
  console.log("Updated localStorage userProgress:", localStorage.getItem('userProgress'))

  // 저장된 값이 있다면 가져오기
  const existingSurvey = localStorage.getItem('userSurvey');
  
  if (existingSurvey) {
    const survey = JSON.parse(existingSurvey);
    noise.value = survey.noise || 0;
    share.value = survey.share || 0;
    home.value = survey.home || 0;
  }
}

// 변경값 로컬스토리지에 저장
function updateLocalStorage(field, value) {
  const existingSurvey = JSON.parse(localStorage.getItem("userSurvey")) || {};
  existingSurvey[field] = value;
  localStorage.setItem("userSurvey", JSON.stringify(existingSurvey));
  console.log(`Updated localStorage userSurvey: ${field} = ${value}`);
}

</script>

<style scoped>
/* 슬라이더 틱의 색상 고정 */
:deep(.v-slider__ticks) {
  background-color: #ffffff !important; /* 틱을 하얀색으로 고정 */
  border-radius: 100%; /* 둥근 모양 */
}

:deep(.v-label) {
  color: #000000;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
}

.small-label {
  color: #000000;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
}

.margin-top-42 {
  margin-top: 42px;
}
</style>