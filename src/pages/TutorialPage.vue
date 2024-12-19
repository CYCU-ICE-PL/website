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
            <div class="button-group">
              <q-btn v-if="index > 0" icon="arrow_back" class="prev-button" color="primary" @click="prevStep" />
              <q-btn v-if="index < steps.length - 1" icon="arrow_forward" class="next-button" color="primary" @click="nextStep" />
              <q-btn v-else class="finish-button" color="primary" @click="finishTutorial">完成</q-btn>
            </div>
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
    image: 'steps/step1.png'
  },
  {
    title: '步驟 2: 連線到 Project X',
    description: '點擊連線按鈕，連線到選擇的 ProjecX。',
    image: 'steps/step2.png'
  },
  {
    title: '步驟 3: 輸入程式碼',
    description: '在輸入框中輸入你要執行的程式碼。',
    image: 'steps/step3.png'
  },
  {
    title: '步驟 4: 執行程式碼 or 可視化分析',
    description: '點擊執行按鈕，執行你輸入的程式碼。 或點擊可視化分析按鈕，查看程式碼的語法樹。',
    image: 'steps/step4.png'
  },
  {
    title: '步驟 5: 查看結果',
    description: '在輸入框與輸出框中檢查程式碼的執行結果。',
    image: 'steps/step5.png'
  }
])

const nextStep = () => {
  if (step.value < steps.value.length) {
    step.value++
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
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

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.next-button, .prev-button, .finish-button {
  margin-top: 1rem;
}
</style>