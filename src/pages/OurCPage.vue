<template>
    <q-page>
      <iframe src="https://pl.lab214b.uk:5001/" style="width: 100%; height: 100vh; border: none;"></iframe>
    </q-page>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { QPage } from 'quasar'
  
  onMounted(() => {
    gtag('event', 'page_view', {
      page_path: '/OurC',
    page_title: 'OurC'
    })
  })
  </script>