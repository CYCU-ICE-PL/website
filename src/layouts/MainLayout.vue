<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-toolbar-title class="title">
          PL
        </q-toolbar-title>
        <q-space />
        <q-btn flat round :icon="isDark ? 'light_mode' : 'dark_mode'" @click="toggleTheme" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isDark = ref($q.dark.isActive)

const toggleTheme = () => {
  $q.dark.toggle()
  isDark.value = $q.dark.isActive
  gtag('event', 'toggle_theme', {
    event_category: 'Theme',
    event_label: isDark.value ? 'Dark Mode' : 'Light Mode',
  })
}
</script>

<style scoped>
.title {
  font-size: 2rem; /* 設定字體大小 */
}
</style>