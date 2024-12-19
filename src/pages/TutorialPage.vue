<template>
  <q-page class="q-pa-md">
    <div class="text-center">
      <h1 class="title">使用教學</h1>
      <p class="description">以下是如何使用 OurScheme 的步驟：</p>
      <q-stepper v-model="step" flat animated>
        <q-step v-for="(stepDetail, index) in steps" :key="index" :name="index + 1" :title="stepDetail.title">
          <div class="step-content">
            <p>{{ stepDetail.description }}</p>
            <img :src="stepDetail.image" alt="Step Image" class="step-image" v-if="stepDetail.image" />
            <q-space />
            <q-btn v-if="index < steps.length - 1" class="next-button" color="primary" @click="nextStep">下一步</q-btn>
            <q-btn v-else class="finish-button" color="primary" @click="finishTutorial">完成</q-btn>
          </div>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()
const step = ref(1)

const steps = ref([
  {
    title: '步驟 1: 選擇Project',
    description: '在 OurScheme 中，首先選擇你要測試的Project。',
    image: 'path/to/step1-image.png'
  },
  {
    title: '步驟 2: 連線到 Interpreter',
    description: '點擊連線按鈕，連線到選擇的 Interpreter。',
    image: 'path/to/step2-image.png'
  },
  {
    title: '步驟 3: 輸入程式碼',
    description: '在輸入框中輸入你要執行的程式碼。',
    image: 'path/to/step3-image.png'
  },
  {
    title: '步驟 4: 執行程式碼 or 可視化分析',
    description: '點擊執行按鈕，執行你輸入的程式碼。 或點擊可視化分析按鈕，查看程式碼的語法樹。',
    image: 'path/to/step4-image.png'
  },
  {
    title: '步驟 5: 查看輸出',
    description: '在輸出框中查看程式碼的執行結果。',
    image: 'path/to/step5-image.png'
  }
])

const nextStep = () => {
  if (step.value < steps.value.length) {
    step.value++
  }
}

const finishTutorial = () => {
  Notify.create({
    message: '教學完成！',
    color: 'positive',
    position: 'top'
  })
  navigateToHome()
}

const navigateToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.text-center {
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
}

.description {
  font-size: 1.25rem;
  margin: 1rem 0;
}

.step-content {
  margin: 1rem 0;
}

.step-image {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
}

.next-button, .finish-button {
  margin-top: 1rem;
}

.back-button {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #007aff;
  color: white;
  border-radius: 0.5rem;
  transition: transform 0.3s ease-in-out;
  text-transform: none;
}

.back-button:hover {
  transform: scale(1.1);
}
</style>