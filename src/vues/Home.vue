<template>
  <v-container 
    class="pt-12 | pl-10 | pr-10" style="max-width: 1200px"
  >
    <v-row class="no-gutters | title-text">
      {{ 25 }}년 {{ 1 }}기 {{ 1 }}주차 진행중 👋🏼
    </v-row>


    <v-row class="box-container | no-gutters | margin-top-52">
      <DashboardStats />
    </v-row>

    <v-row class="box-container | no-gutters | mt-8 ">
      <AttendanceView />
    </v-row>
      
    <v-row class="box-container | no-gutters | mt-8">
      <ArchiveView />
    </v-row>
  </v-container>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import { routes } from "@/router"

import AttendanceView from '@/vues/Pages/AttendanceView.vue'
import ArchiveView from '@/vues/Pages/ArchiveView.vue'
import DashboardStats from "./Pages/DashboardStats.vue";

const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

// ----- 라이프 사이클 ----- //

onMounted(() => {
})

onUnmounted(() => {

});

// ----- 함수 정의 ----- //
function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}

</script>

<style scoped>
.box-container {
  background-color: #FFFFFF;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
}

.title-text {
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.margin-top-52 {
  margin-top: 52px;
}

</style>