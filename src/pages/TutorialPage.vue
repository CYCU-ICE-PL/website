<template>
  <q-page class="q-pa-md">
    <div class="text-center">
      <h1 class="title">使用教學</h1>
      <p class="description">以下是如何使用 OurScheme 的步驟：</p>
      
      <q-stepper v-model="step" flat animated class="tutorial-stepper">
        <q-step v-for="(stepDetail, index) in steps" :key="index" :name="index + 1" :title="stepDetail.title">
          <div class="step-content">
            <div class="step-header">
              <q-icon :name="stepDetail.icon" class="step-icon" />
              <h2 class="step-title">{{ stepDetail.title }}</h2>
            </div>
            
            <p class="step-description">{{ stepDetail.description }}</p>
            
            <div v-if="stepDetail.images" class="step-images">
              <div v-for="(image, imgIndex) in stepDetail.images" :key="imgIndex" class="image-container">
                <img :src="image" :alt="'Step ' + (index + 1) + ' Image ' + (imgIndex + 1)" class="step-image" />
                <div class="image-overlay" @click="showImagePreview(image)">
                  <q-icon name="zoom_in" size="2rem" />
                </div>
              </div>
            </div>

            <div v-if="stepDetail.tips" class="tips-section">
              <q-expansion-item
                icon="tips_and_updates"
                label="提醒"
                header-class="tips-header"
                expand-icon-class="tips-icon"
              >
                <q-card>
                  <q-card-section>
                    <ul class="tips-list">
                      <li v-for="(tip, tipIndex) in stepDetail.tips" :key="tipIndex">
                        {{ tip }}
                      </li>
                    </ul>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>

            <q-space />
            
            <div class="button-group">
              <q-btn v-if="index > 0" 
                     icon="arrow_back" 
                     class="prev-button" 
                     @click="prevStep">
                <q-tooltip>上一步</q-tooltip>
              </q-btn>
              <q-btn v-if="index < steps.length - 1" 
                     icon="arrow_forward" 
                     class="next-button" 
                     @click="nextStep">
                <q-tooltip>下一步</q-tooltip>
              </q-btn>
              <q-btn v-else 
                     class="finish-button" 
                     @click="finishTutorial">
                <q-icon name="check" class="q-mr-sm" />
                完成教學
              </q-btn>
            </div>
          </div>
        </q-step>
      </q-stepper>
    </div>

    <!-- 圖片預覽對話框 -->
    <q-dialog v-model="showPreview" maximized>
      <q-card class="preview-card">
        <q-card-section class="row items-center">
          <div class="text-h6">圖片預覽</div>
        </q-card-section>

        <q-card-section class="preview-content">
          <img :src="previewImage" alt="Preview" class="preview-image" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()
const step = ref(1)
const showPreview = ref(false)
const previewImage = ref('')

const steps = ref([
  {
    title: '步驟 1: 選擇Project',
    description: '在 OurScheme 中，首先選擇你要測試的Project。',
    icon: 'folder_open',
    images: ['steps/step1.png'],
    tips: [
      '建議先從 project1 開始練習',
      '每個 project 都有不同的測試重點'
    ]
  },
  {
    title: '步驟 2: 點擊 Project',
    description: '點擊連線Project按鈕，連線到選擇的 Project。',
    icon: 'link',
    images: ['steps/step2.png'],
    tips: [
      '確保網路連線穩定',
      '如果連線失敗，可以嘗試重新整理頁面'
    ]
  },
  {
    title: '步驟 3: 輸入程式碼',
    description: '在輸入框中輸入你要執行的程式碼。',
    icon: 'edit_note',
    images: ['steps/step3.png'],
    tips: [
      '可以輸入單行也可以多行程式碼'
    ]
  },
  {
    title: '步驟 4: 送出程式碼',
    description: '點擊送出按鈕，讓後端(直譯器)讀取你輸入的程式碼。',
    icon: 'send',
    images: ['steps/step4-1.png'],
    tips: [
      '送出前請確認程式碼是否完整',
      '系統會自動append \'\\n\'到你的程式碼中'
    ]
  },
  {
    title: '步驟 5: 查看結果',
    description: '在輸入框與輸出框中檢查歷史輸入和執行結果。',
    icon: 'visibility',
    images: ['steps/step5-1.png'],
    tips: [
      '可以查看歷史記錄了解執行過程',
      '如果結果不符合預期，可以檢查輸入的程式碼'
    ]
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
    position: 'top',
    icon: 'check_circle',
    timeout: 2000
  })
  navigateToHome()
}

const navigateToHome = () => {
  router.push('/')
}

const showImagePreview = (image) => {
  previewImage.value = image
  showPreview.value = true
}
</script>

<style scoped>
.text-center {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%);
  min-height: 100vh;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.description {
  font-size: 1.25rem;
  margin: 1rem 0;
  color: #4a5568;
  line-height: 1.6;
}

.tutorial-stepper {
  max-width: 800px;
  margin: 0 auto;
  background: transparent;
}

.step-content {
  margin: 1rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.step-icon {
  font-size: 2rem;
  color: #8b9dc3;
  margin-right: 1rem;
}

.step-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.step-description {
  font-size: 1.2rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.step-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.step-image {
  width: 100%;
  height: auto;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.tips-section {
  margin-top: 2rem;
}

.tips-header {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.tips-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 0.5rem 0;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.tips-list li:before {
  content: "💡";
  margin-right: 0.5rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.next-button, .prev-button, .finish-button {
  background: linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.next-button:hover, .prev-button:hover, .finish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  overflow: hidden;
}

.preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f8f9fa;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.q-stepper) {
  background: transparent;
}

:deep(.q-step) {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  padding: 1rem;
}

:deep(.q-step__title) {
  color: #2c3e50;
  font-weight: 600;
}

:deep(.q-step__description) {
  color: #4a5568;
}
</style>