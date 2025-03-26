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
})
</script>

<style scoped>
.fullscreen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin: 2rem;
}

.content > div:first-child {
  font-size: 8rem;
  color: #2c3e50;
  opacity: 0.8;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.text-h2 {
  color: #4a5568;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.meme-image {
  flex: 1;
  width: 100%;
  height: auto;
  max-height: 50vh;
  margin-top: 20px;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quote {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #6b7b9c;
  opacity: 0.8;
  font-style: italic;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
}

:deep(.q-btn) {
  background: linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.q-btn:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>