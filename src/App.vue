<template>
  <v-app>
    <v-navigation-drawer app permanent width="200" color="white">
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title-logo">
              <v-icon size="20" icon="mdi-trending-up" class="mr-2" />
              째깍째깍 블로그 챌린지
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="page in pageList"
          :key="page.value"
          :to="page.to"
          :value="page.value"
          :active="tab === page.value"
          @click="tab = page.value"
          :class="{
            'nav-item': true,
            'nav-item--active': tab === page.value,
          }"
          class="mb-2 | ml-2 | mr-2"
        >
          
          <v-list-item-title>{{ page.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
// ----- 선언부 ----- //
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const tab = ref("home");

const pageList = [
  { label: '대시보드', value: 'home', to: '/home' },
  { label: '챌린지 규칙', value: 'rules', to: '/rules' },
  { label: '참여자', value: 'members', to: '/members' },
  // 필요시 추가 가능: { label: '참여자 정보', value: 'participants', to: '/participants' }
]

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes("home")) tab.value = "home";
    else if (newPath.includes("users")) tab.value = "users";
    else if (newPath.includes("rules")) tab.value = "rules";
  },
  { immediate: true }
);

// ----- 다이얼로그 ----- //
const dialog = ref({
  title: '',
  text: '',
  isActive: false,
  okButton() {}
});

function openDialog(title, text, onConfirm) {
  dialog.value.title = title;
  dialog.value.text = text;
  dialog.value.okButton = onConfirm;
  dialog.value.dialogActive = true;
}
</script>

<style scoped>
.nav-item {
  min-height: 36px !important; /* 기본 min-height override */
  height: 36px;
  line-height: 36px;
  border-radius: 8px;

  color: #9197B3;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #F2EFFF;
  color: #333;
}

.nav-item--active {
  background-color: #5932EA;
  color: #FFFFFF;
  font-weight: bold;
}
</style>
