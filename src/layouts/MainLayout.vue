<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />
        <q-btn flat round icon="home" @click="goHome" />
        <q-space />
        <q-btn flat round :icon="isDark ? 'light_mode' : 'dark_mode'" @click="toggleTheme" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above>
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
        <q-separator />
        <q-item to="/Tutorial" clickable>
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>教學</q-item-section>.
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const isDark = ref($q.dark.isActive)
const drawer = ref(false)

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