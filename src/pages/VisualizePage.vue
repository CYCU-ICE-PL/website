<template>
    <q-page>
      <iframe src="https://visualpl-new.lab214b.uk:5001/" style="width: 100%; height: 100vh; border: none;"></iframe>
    </q-page>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { QPage } from 'quasar'
  
  onMounted(() => {
    gtag('event', 'page_view', {
      page_path: '/Visualize',
      page_title: 'Visualize'
    })
  })
  </script>