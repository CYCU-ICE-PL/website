<template>
    <q-page>
      <iframe src="https://memeprod.ap-south-1.linodeobjects.com/user-maker-thumbnail/180a04e4379a720c075a1b3c784c7b9e.gif" style="width: 100%; height: 100vh; border: none;"></iframe>
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