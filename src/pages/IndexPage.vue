<template>
  <div class="text-center">
    <img src="icons/favicon.svg" alt="Logo" class="my-image" />
    <q-toolbar-title class="animated-title">歡迎來到 PL 可視化</q-toolbar-title>
    <div class="animated-paragraph">中原大學資訊工程學系「程式語言」課程學習輔助工具，用於OurScheme和OurC的可視化和執行追蹤。</div>
    <q-space class="q-mt-md" />
    <q-btn class="animated-button" color="primary" @click="navigateToOurScheme">OurScheme</q-btn>
    <q-btn class="animated-button" color="primary" @click="navigateToOurC">OurC</q-btn>
    <q-space class="q-mt-md" />
    <div>
      <q-btn class="animated-button" color="secondary" icon="school" @click="navigateToTutorial">教學</q-btn>
      <q-btn class="animated-button" color="secondary" icon="info" @click="navigateToAbout">關於</q-btn>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToOurScheme = () => {
router.push('/OurScheme')
}

const navigateToOurC = () => {
router.push('/OurC')
}

const navigateToTutorial = () => {
router.push('/Tutorial')
}

const navigateToAbout = () => {
router.push('/About')
}

</script>

<style scoped>
.my-image {
width: 400px;
height: auto;
}

.text-center {
text-align: center;
padding: 2rem;
}

.animated-title {
font-size: 2.5rem;
font-weight: 600;
animation: fadeIn 1.5s ease-in-out;
}

.animated-paragraph {
font-size: 1.25rem;
margin: 1rem 0;
animation: slideIn 1.5s ease-in-out;
}

.animated-button {
font-size: 1rem;
padding: 0.75rem 1.5rem;
background-color: #007aff;
color: white;
border-radius: 0.5rem;
transition: transform 0.3s ease-in-out;
text-transform: none; /* 確保文字不轉換為大寫 */
margin: 0.5rem;
}

.animated-button:hover {
transform: scale(1.1);
}

@keyframes fadeIn {
0% { opacity: 0; }
100% { opacity: 1; }
}

@keyframes slideIn {
0% { transform: translateY(20px); opacity: 0; }
100% { transform: translateY(0); opacity: 1; }
}
</style>