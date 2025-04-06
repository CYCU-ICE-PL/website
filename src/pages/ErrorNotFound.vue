<template>
  <q-page class="error-page flex column items-center justify-center q-pa-md">
    <q-card class="error-card">
      <q-card-section class="text-center">
        <div class="text-weight-bold error-code">404</div>
        <div class="text-h4 q-mb-md">你迷路了嗎？</div>
        <q-btn
          color="primary"
          unelevated
          to="/"
          label="回首頁"
          no-caps
          class="return-btn"
        />
        <div class="quote q-mt-md" v-if="quote">
          {{ quote }}
        </div>
      </q-card-section>
    </q-card>
    
    <q-card class="meme-card q-mt-md">
      <q-card-section class="text-center">
        <div class="text-h6 q-mb-sm">隨機迷因</div>
        <q-separator class="q-mb-md" />
        
        <div class="meme-container">
          <!-- 加載指示器 -->
          <div v-if="isLoading" class="flex column items-center justify-center full-width full-height">
            <q-spinner-dots size="40px" color="primary" />
            <div class="text-primary q-mt-sm" style="font-size: 1.1em">獲取迷因中...</div>
          </div>
          
          <!-- 錯誤狀態顯示 -->
          <div v-else-if="!memeUrl" class="error-placeholder">
            <q-icon name="sentiment_dissatisfied" size="4rem" color="grey-7" />
            <div class="text-body1 q-mt-sm text-grey-8">無法載入迷因圖片</div>
            <q-btn
              flat
              color="primary"
              icon="refresh"
              label="重新嘗試"
              @click="refreshMeme"
              class="q-mt-md"
            />
          </div>
          
          <!-- 成功加載的圖片顯示 -->
          <div v-else class="meme-loaded-container">
            <!-- 調試信息 -->
            <q-img
              :src="memeUrl"
              class="meme-image"
              fit="contain"
              @load="imageLoaded"
              @error="handleImageError"
            >
              <template v-slot:loading>
                <q-spinner-dots color="primary" />
              </template>
              <template v-slot:error>
                <div class="text-center q-pa-md">
                  <q-icon name="error" size="2rem" color="negative" />
                  <div class="text-body1 q-mt-sm">圖片載入失敗</div>
                  <q-btn
                    flat
                    color="primary"
                    icon="refresh"
                    label="重新嘗試"
                    @click="refreshMeme"
                    class="q-mt-md"
                    size="sm"
                  />
                </div>
              </template>
            </q-img>
            
            <q-btn
              flat
              color="primary"
              icon="refresh"
              label="換一張"
              @click="refreshMeme"
              class="q-mt-md refresh-btn"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md" v-if="retryInfo">
        <q-badge color="orange" class="retry-badge">
          {{ retryInfo }}
        </q-badge>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getQuote } from 'src/data/quotes'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const memeUrl = ref('')
const quote = ref('')
const isLoading = ref(true)
const retryCount = ref(0)
const maxRetries = 3

const retryInfo = computed(() => {
  if (retryCount.value > 0) {
    return `自動重試 ${retryCount.value}/${maxRetries}`
  }
  return null
})

const fetchRandomMeme = async () => {
  try {
    isLoading.value = true
    const response = await fetch('https://meme-api.com/gimme')
    
    if (!response.ok) {
      throw new Error(`獲取迷因失敗：${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.url) {
      throw new Error('迷因API返回的數據不包含圖片URL')
    }
    
    // 嘗試載入主圖片URL或備用預覽圖
    tryLoadImage(data)
    
  } catch (error) {
    console.error('Error fetching meme:', error)
    
    if (retryCount.value < maxRetries) {
      retryCount.value++
      $q.notify({
        message: `正在嘗試重新獲取迷因圖片 (${retryCount.value}/${maxRetries})...`,
        color: 'warning',
        icon: 'refresh',
        timeout: 2000
      })
      
      // 延遲1秒後重試
      setTimeout(() => {
        fetchRandomMeme()
      }, 1000)
    } else {
      isLoading.value = false
      $q.notify({
        message: '無法載入迷因圖片，請稍後重試',
        color: 'negative',
        icon: 'error',
        timeout: 3000
      })
    }
  }
}

// 嘗試載入主圖片或備用預覽圖
const tryLoadImage = (data) => {
  const mainUrl = data.url
  const previewUrls = data.preview || []
  
  // 先嘗試主圖片URL
  const imgPreload = new Image()
  
  imgPreload.onload = () => {
    memeUrl.value = mainUrl
    // 確保圖片加載後設置isLoading為false
    setTimeout(() => {
      isLoading.value = false
    }, 100)
    retryCount.value = 0 // 重置重試計數
  }
  
  imgPreload.onerror = () => {
    console.error('主圖片載入失敗，嘗試預覽圖')
    // 如果主圖片載入失敗，嘗試使用預覽圖（從最大尺寸開始）
    if (previewUrls.length > 0) {
      tryPreviewImages(previewUrls.reverse())
    } else {
      // 如果沒有預覽圖可用，報告錯誤
      console.error('沒有可用的預覽圖')
      if (retryCount.value < maxRetries) {
        retryCount.value++
        setTimeout(() => {
          fetchRandomMeme()
        }, 1000)
      } else {
        isLoading.value = false
      }
    }
  }
  
  // 開始載入主圖片
  imgPreload.src = mainUrl
}

// 嘗試載入預覽圖片（從高解析度到低解析度）
const tryPreviewImages = (previewUrls) => {
  if (previewUrls.length === 0) {
    console.error('所有預覽圖都載入失敗')
    if (retryCount.value < maxRetries) {
      retryCount.value++
      setTimeout(() => {
        fetchRandomMeme()
      }, 1000)
    } else {
      isLoading.value = false
    }
    return
  }
  
  const previewUrl = previewUrls.shift()
  const imgPreview = new Image()
  
  imgPreview.onload = () => {
    memeUrl.value = previewUrl
    // 確保圖片加載後設置isLoading為false
    setTimeout(() => {
      isLoading.value = false
    }, 100)
    retryCount.value = 0
  }
  
  imgPreview.onerror = () => {
    // 嘗試下一個預覽圖
    tryPreviewImages(previewUrls)
  }
  
  imgPreview.src = previewUrl
}

const imageLoaded = () => {
  isLoading.value = false
}

const handleImageError = () => {
  isLoading.value = false
  
  if (retryCount.value < maxRetries) {
    retryCount.value++
    // 自動嘗試重新獲取
    fetchRandomMeme()
  }
}

const refreshMeme = () => {
  retryCount.value = 0
  fetchRandomMeme()
}

const fetchRandomQuote = () => {
  quote.value = getQuote()
}

onMounted(() => {
  fetchRandomMeme()
  fetchRandomQuote()
})
</script>

<style scoped>
.error-page {
  min-height: calc(100vh - 50px);
  background: transparent;
}

.error-card, .meme-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.error-card:hover, .meme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.error-code {
  font-size: 8rem;
  color: #2c3e50;
  opacity: 0.8;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  line-height: 1;
}

.return-btn {
  background: linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.return-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.meme-container {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.meme-loaded-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.meme-image {
  max-height: 300px;
  width: 100%;
}

.refresh-btn {
  margin: 0 auto;
}

.error-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.retry-badge {
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
}

.quote {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #6b7b9c;
  opacity: 0.8;
  font-style: italic;
  text-align: center;
  line-height: 1.6;
}

@media (max-width: 600px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-card, .meme-card {
    margin: 0 1rem;
  }
  
  .meme-container {
    height: 250px;
  }
  
  .meme-image {
    max-height: 250px;
  }
}
</style>