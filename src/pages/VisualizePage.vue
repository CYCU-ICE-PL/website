<template>
  <q-page>
    <iframe
      src="https://pl-visualize-tmp.ja-errorpro.codes/"
      style="width: 100%; height: 100vh; border: none"
    ></iframe>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { QPage } from 'quasar'

onMounted(() => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: '/Visualize',
      page_title: 'Visualize',
    })
  }
})
</script>
