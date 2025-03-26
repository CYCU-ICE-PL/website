<template>
  <div class="container">
    <div class="content-wrapper">
      <img src="icons/favicon.svg" alt="Logo" class="logo" />
      <h1 class="main-title">歡迎來到 PL 可視化</h1>
      <p class="description">中原大學資訊工程學系「程式語言」課程學習輔助工具，用於OurScheme和OurC的可視化和執行追蹤。</p>
      
      <div class="button-group">
        <q-btn class="action-btn primary" @click="navigateToOurScheme">
          <q-icon name="code" class="btn-icon" />
          OurScheme
        </q-btn>
        <q-btn class="action-btn primary" @click="navigateToOurC">
          <q-icon name="code" class="btn-icon" />
          OurC
        </q-btn>
      </div>

      <div class="button-group">
        <q-btn class="action-btn secondary" @click="navigateToTutorial">
          <q-icon name="school" class="btn-icon" />
          教學
        </q-btn>
        <q-btn class="action-btn secondary" @click="navigateToAbout">
          <q-icon name="info" class="btn-icon" />
          關於
        </q-btn>
      </div>
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
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%);
}

.content-wrapper {
  max-width: 800px;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: fadeIn 1.2s ease-out;
}

.logo {
  width: 180px;
  height: auto;
  margin-bottom: 2.5rem;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
}

.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  animation: slideDown 1s ease-out;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.description {
  font-size: 1.3rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 3rem;
  animation: slideUp 1s ease-out;
  font-weight: 400;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeIn 1.2s ease-out;
}

.action-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 16px;
  text-transform: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%);
  color: white;
  border: none;
}

.action-btn.secondary {
  background: linear-gradient(135deg, #b8c2cc 0%, #9ba5b0 100%);
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.4rem;
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: scale(0.98);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
</style>