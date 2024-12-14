<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-sm  flex-center">
    <div class="content">
      <div style="font-size: 10rem; opacity:.8">
        404
      </div>

      <div class="text-h2" style="opacity:.8">
        你迷路了嗎？
        
        <q-btn
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="回首頁"
          no-caps
        />
      </div>
      <div class="quote" v-if="quote">
        {{ quote }}
      </div>
    </div>
    <img :src="memeUrl" alt="Random Meme" class="meme-image" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getQuote } from 'src/data/quotes'

const memeUrl = ref('')
const quote = ref('')

const fetchRandomMeme = async () => {
  try {
    const response = await fetch('https://meme-api.com/gimme')
    const data = await response.json()
    memeUrl.value = data.url
  } catch (error) {
    console.error('Error fetching meme:', error)
  }
}

const fetchRandomQuote = () => {
  quote.value = getQuote()
}

onMounted(() => {
  fetchRandomMeme()
  fetchRandomQuote()
  gtag('event', '404 page_view', {
    event_category: 'Error',
    event_label: '404 Page'
  })
})
</script>

<style scoped>
.fullscreen {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.meme-image {
  flex: 1;
  width: 100%;
  height: auto;
  max-height: 50vh; /* 限制圖片的最大高度 */
  margin-top: 20px;
  object-fit: contain; /* 確保圖片在容器內適當顯示 */
}

.quote {
  margin-top: 20px;
  font-size: 1.5rem;
  opacity: 0.8;
}
</style>