<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-btn flat round icon="home" @click="goHome" />
        <q-toolbar-title>{{ currentPageTitle }}</q-toolbar-title>
        <q-btn flat round :icon="isDark ? 'light_mode' : 'dark_mode'" @click="toggleTheme" />
        <q-img 
        src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://cycu-ice-pl.github.io/website/&count_bg=%2379C83D&title_bg=%23555555&icon_color=%23E7E7E7&title=views&edge_flat=false"
        alt="瀏覽次數"
        style="width: 150px; height: auto;"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer">
      <q-list>
        <q-item to="/" exact clickable>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>首頁</q-item-section>
        </q-item>
        <q-separator />
        <q-item to="/OurScheme" clickable>
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>OurScheme</q-item-section>
        </q-item>
        <q-item to="/OurC" clickable>
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>OurC</q-item-section>
        </q-item>
        <q-item to = "/Visualize" clickable >
          <q-item-section avatar>
            <q-icon name="visibility" />
          </q-item-section>
          <q-item-section>可視化</q-item-section>
        </q-item>
        <q-separator />
        <q-item to="/Tutorial" clickable>
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>教學</q-item-section>
        </q-item>
        <q-item to="/About" clickable>
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>關於</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const isDark = ref($q.dark.isActive)
const drawer = ref(false)
const currentPageTitle = ref('')

const toggleTheme = () => {
  $q.dark.toggle()
  isDark.value = $q.dark.isActive
  gtag('event', 'toggle_theme', {
    event_category: 'Theme',
    event_label: isDark.value ? 'Dark Mode' : 'Light Mode',
  })
}

const goHome = () => {
  router.push('/')
}

// 在組件掛載時發送 gtag 事件
onMounted(() => {
  currentPageTitle.value = router.currentRoute.value.name
  gtag('event', 'page_view', {
    page_path: router.currentRoute.value.fullPath,
    page_title: router.currentRoute.value.name,
  })
})

// 使用 router.beforeEach 來監聽路由變更
router.beforeEach((to, _, next) => {
  currentPageTitle.value = to.name
  gtag('event', 'page_view', {
    page_path: to.fullPath,
    page_title: to.name,
  })
  next()
})
</script>

<style scoped>
.title {
  font-size: 2rem; /* 設定字體大小 */
}

.q-drawer {
  background-color: #f5f5f5; /* 背景顏色 */
}

.q-item {
  font-size: 1.1rem; /* 字體大小 */
}

.q-item-section {
  display: flex;
  align-items: center;
}
</style>