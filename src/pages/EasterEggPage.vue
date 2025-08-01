<template>
  <q-page class="easter-egg-container q-pa-md">
    <div class="easter-egg-content">
      <!-- 主標題區塊 -->
      <q-card class="main-card q-mb-lg">
        <q-card-section class="text-center">
          <div class="egg-title text-gradient">🎉 恭喜你發現了隱藏頁面！ 🎉</div>
          <div class="egg-description">
            <p>你是如何找到這個頁面的？你一定是個善於探索的人！</p>
            <p class="text-primary">
              這是一個<span class="text-bold">只有中原資工PL可視化專用</span
              >的秘密頁面，歡迎你的到來！
            </p>
          </div>
        </q-card-section>
        <div class="floating-dots"></div>
      </q-card>

      <!-- 貪吃蛇遊戲區塊 -->
      <q-card class="game-card q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h4 text-primary text-weight-bold game-title">
              <q-icon name="sports_esports" class="q-mr-sm bounce" />貪吃蛇遊戲
            </div>
          </div>
          <q-separator color="primary" size="2px" spaced />
          <p class="text-body1 text-center q-my-md text-grey-7">
            使用方向鍵控制蛇的移動方向，吃到食物可以增加分數和長度。
          </p>

          <div v-if="!gameStarted" class="text-center q-pa-md game-start-container">
            <q-btn
              color="primary"
              class="start-btn"
              label="開始遊戲"
              @click="startGame"
              size="lg"
              unelevated
              rounded
              padding="lg"
            >
              <q-icon name="play_arrow" class="on-right" />
            </q-btn>
          </div>
          <div v-else class="text-center">
            <div class="canvas-container">
              <canvas ref="gameCanvas" width="300" height="300" class="game-canvas"></canvas>
              <div class="game-overlay" :class="{ 'pause-overlay': isPaused }">
                <div v-if="isPaused" class="pause-text">暫停中</div>
              </div>
            </div>
            <div class="q-mt-md">
              <div class="text-h5 q-mb-md score-display">
                <span class="score-label">分數:</span>
                <span class="score-value">{{ score }}</span>
              </div>
              <div class="row justify-center q-gutter-md">
                <q-btn
                  :color="isPaused ? 'positive' : 'warning'"
                  :icon="isPaused ? 'play_arrow' : 'pause'"
                  :label="isPaused ? '繼續' : '暫停'"
                  @click="togglePause"
                  rounded
                  unelevated
                />
                <q-btn
                  color="negative"
                  icon="refresh"
                  label="重新開始"
                  @click="resetGame"
                  rounded
                  unelevated
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 神秘格言區塊 -->
      <q-card class="quote-card q-mb-lg">
        <q-card-section>
          <div class="text-h4 text-center q-mb-md text-secondary text-weight-bold quote-title">
            <q-icon name="format_quote" class="q-mr-sm rotate-quote-icon" />神秘格言
          </div>
          <q-separator color="secondary" size="2px" spaced />
          <q-card class="quote-box q-my-lg" flat bordered>
            <q-card-section class="text-center text-italic q-pa-lg">
              <q-icon
                name="format_quote"
                size="24px"
                color="secondary"
                class="absolute-top-left q-ma-sm flip-icon"
              />
              <div class="quote-text">{{ randomQuote }}</div>
              <q-icon
                name="format_quote"
                size="24px"
                color="secondary"
                class="absolute-bottom-right q-ma-sm rotate-180 flip-icon"
              />
            </q-card-section>
          </q-card>
          <div class="text-center">
            <q-btn
              color="secondary"
              label="換一句"
              @click="getNewQuote"
              icon="autorenew"
              class="refresh-quote-btn"
              unelevated
              rounded
              padding="md lg"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- 返回區塊 -->
      <div class="text-center q-mt-xl">
        <q-btn
          to="/"
          color="primary"
          label="返回首頁"
          icon="home"
          class="return-btn"
          rounded
          unelevated
          padding="md xl"
          size="lg"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getEasterPageQuote } from 'src/data/quotes'

const randomQuote = ref('')
const gameCanvas = ref(null)
const gameStarted = ref(false)
const score = ref(0)
const isPaused = ref(false)

// 遊戲變數
let ctx = null
let snake = []
let food = { x: 0, y: 0 }
let direction = 'right'
let gameLoop = null
let cellSize = 10
let gameSpeed = 100

onMounted(() => {
  // 獲取一個隨機名言
  randomQuote.value = getEasterPageQuote()

  // 在控制台輸出彩蛋訊息
  console.log('你找到了隱藏頁面彩蛋！')

  // 監聽鍵盤事件
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 清理事件監聽和遊戲循環
  window.removeEventListener('keydown', handleKeyDown)
  if (gameLoop) {
    clearInterval(gameLoop)
  }
})

// 獲取新名言
const getNewQuote = () => {
  randomQuote.value = getEasterPageQuote()
}

// 遊戲相關函數
const startGame = () => {
  gameStarted.value = true
  score.value = 0
  isPaused.value = false

  // 在下一個 tick 初始化遊戲
  setTimeout(() => {
    initGame()
  }, 0)
}

const initGame = () => {
  if (!gameCanvas.value) return

  // 獲取 canvas 上下文
  ctx = gameCanvas.value.getContext('2d')

  // 初始化蛇
  snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
  ]

  // 隨機放置食物
  generateFood()

  // 設定方向
  direction = 'right'

  // 開始遊戲循環
  if (gameLoop) {
    clearInterval(gameLoop)
  }

  gameLoop = setInterval(() => {
    if (!isPaused.value) {
      moveSnake()
      checkCollision()
      drawGame()
    }
  }, gameSpeed)
}

const generateFood = () => {
  // 生成隨機食物位置，確保對齊網格
  food = {
    x: Math.floor(Math.random() * (gameCanvas.value.width / cellSize)) * cellSize,
    y: Math.floor(Math.random() * (gameCanvas.value.height / cellSize)) * cellSize,
  }

  // 確保食物不在蛇身上
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      generateFood()
      break
    }
  }
}

const moveSnake = () => {
  // 根據方向移動蛇頭
  const head = { x: snake[0].x, y: snake[0].y }

  switch (direction) {
    case 'up':
      head.y -= cellSize
      break
    case 'down':
      head.y += cellSize
      break
    case 'left':
      head.x -= cellSize
      break
    case 'right':
      head.x += cellSize
      break
  }

  // 添加新頭部
  snake.unshift(head)

  // 檢查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    score.value += 10
    generateFood()
  } else {
    // 如果沒吃到食物，移除尾部
    snake.pop()
  }
}

const checkCollision = () => {
  const head = snake[0]

  // 檢查牆壁碰撞
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= gameCanvas.value.width ||
    head.y >= gameCanvas.value.height
  ) {
    gameOver()
    return
  }

  // 檢查自身碰撞
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver()
      return
    }
  }
}

const drawGame = () => {
  if (!ctx) return

  // 清除畫布
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)

  // 繪製網格
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 0.5

  for (let i = 0; i < gameCanvas.value.width; i += cellSize) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, gameCanvas.value.height)
    ctx.stroke()
  }

  for (let i = 0; i < gameCanvas.value.height; i += cellSize) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(gameCanvas.value.width, i)
    ctx.stroke()
  }

  // 繪製食物 - 使用漸變顏色
  const foodGradient = ctx.createRadialGradient(
    food.x + cellSize / 2,
    food.y + cellSize / 2,
    0,
    food.x + cellSize / 2,
    food.y + cellSize / 2,
    cellSize,
  )
  foodGradient.addColorStop(0, '#ff5e7a')
  foodGradient.addColorStop(1, '#ff1744')

  ctx.fillStyle = foodGradient
  ctx.beginPath()
  ctx.arc(food.x + cellSize / 2, food.y + cellSize / 2, cellSize / 2, 0, Math.PI * 2)
  ctx.fill()

  // 繪製蛇 - 使用漸變色和圓角
  snake.forEach((segment, index) => {
    // 設定漸變色
    if (index === 0) {
      // 蛇頭 - 更亮的顏色
      ctx.fillStyle = '#1de9b6'
    } else {
      // 蛇身 - 根據位置變化顏色
      const hue = 160 - ((index * 2) % 60)
      ctx.fillStyle = `hsl(${hue}, 90%, 60%)`
    }

    // 繪製圓角矩形
    roundRect(ctx, segment.x, segment.y, cellSize, cellSize, index === 0 ? 4 : 2)

    // 添加高光效果
    if (index === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.beginPath()
      ctx.arc(segment.x + cellSize / 4, segment.y + cellSize / 4, cellSize / 6, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

// 繪製圓角矩形的輔助函數
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x + radius, y + height)
  ctx.arcTo(x, y + height, x, y + height - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
  ctx.fill()
}

const handleKeyDown = (e) => {
  if (!gameStarted.value || isPaused.value) return

  // 防止方向鍵滾動頁面
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
  }

  switch (e.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up'
      break
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down'
      break
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left'
      break
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right'
      break
  }
}

const gameOver = () => {
  clearInterval(gameLoop)
  alert(`遊戲結束！你的得分是: ${score.value}`)
  gameStarted.value = false
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const resetGame = () => {
  if (gameLoop) {
    clearInterval(gameLoop)
  }
  startGame()
}
</script>

<style scoped>
.easter-egg-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #6246ea 0%, #e45a84 100%);
  position: relative;
  overflow: hidden;
}

/* 添加背景圖案 */
.easter-egg-container:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 10%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 10%);
  opacity: 0.8;
  z-index: 0;
}

.easter-egg-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.main-card,
.game-card,
.quote-card {
  border-radius: 20px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: none;
  overflow: hidden;
  position: relative;
}

.main-card:hover,
.game-card:hover,
.quote-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.25),
    0 10px 20px rgba(0, 0, 0, 0.15);
}

/* 文字漸層效果 */
.text-gradient {
  background: linear-gradient(90deg, #6246ea, #e45a84);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.egg-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.8rem;
  letter-spacing: -0.5px;
  animation: pulse 2s infinite;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.egg-description {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.8;
}

/* 遊戲卡片樣式 */
.game-title {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.score-display {
  background: linear-gradient(90deg, #1de9b6, #00b8d4);
  border-radius: 30px;
  padding: 8px 16px;
  display: inline-block;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 184, 212, 0.3);
}

.score-label {
  opacity: 0.9;
}

.score-value {
  font-size: 1.5rem;
  margin-left: 5px;
}

.canvas-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem auto;
  position: relative;
  width: 300px;
  height: 300px;
}

.game-canvas {
  border: 3px solid #2c3e50;
  border-radius: 12px;
  background-color: #f8f9fa;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.1),
    inset 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.pause-overlay {
  background: rgba(0, 0, 0, 0.7);
  opacity: 1;
  border-radius: 12px;
}

.pause-text {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: pulseFade 1.5s infinite;
}

.game-start-container {
  padding: 2rem;
}

.start-btn {
  font-size: 1.2rem;
  font-weight: bold;
  transform-origin: center;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(98, 70, 234, 0.4);
}

/* 引用卡片樣式 */
.quote-title {
  display: inline-flex;
  align-items: center;
}

.quote-box {
  background: rgba(248, 249, 250, 0.9);
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 500;
  position: relative;
  padding: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.quote-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}

.quote-text {
  padding: 0.5rem 2rem;
  position: relative;
  line-height: 1.8;
}

.refresh-quote-btn {
  transition: all 0.3s ease;
}

.refresh-quote-btn:hover {
  transform: rotate(15deg);
}

.return-btn {
  padding: 1rem 2rem;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 10px 25px rgba(98, 70, 234, 0.4);
  transition: all 0.3s ease;
}

.return-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(98, 70, 234, 0.5);
}

/* 浮動點動畫 */
.floating-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.floating-dots::before,
.floating-dots::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0.5;
}

.floating-dots::before {
  background: #6246ea;
  top: 20%;
  left: 10%;
  animation: float 6s infinite;
}

.floating-dots::after {
  background: #e45a84;
  bottom: 15%;
  right: 15%;
  animation: float 8s infinite reverse;
}

/* 動畫 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulseFade {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, 10px);
  }
  50% {
    transform: translate(5px, 15px);
  }
  75% {
    transform: translate(-5px, 5px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.rotate-quote-icon {
  animation: rotateIcon 12s infinite linear;
  display: inline-block;
}

@keyframes rotateIcon {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.flip-icon {
  animation: flipIcon 5s infinite ease-in-out;
  transform-origin: center;
}

@keyframes flipIcon {
  0%,
  100% {
    transform: rotateY(0deg) rotate(0deg);
  }
  50% {
    transform: rotateY(180deg) rotate(0deg);
  }
}
</style>
