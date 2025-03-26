<template>
  <div class="easter-egg-container">
    <div class="easter-egg-content">
      <h1 class="egg-title">🎉 恭喜你發現了隱藏頁面！ 🎉</h1>
      <div class="egg-description">
        <p>你是如何找到這個頁面的？你一定是個善於探索的人！</p>
        <p>這是一個只有中原資工PL可視化專用的秘密頁面，歡迎你的到來！</p>
      </div>
      
      <div class="snake-game">
        <h3>貪吃蛇遊戲</h3>
        <p class="game-instructions">使用方向鍵控制蛇的移動方向，吃到食物可以增加分數和長度。</p>
        <div v-if="!gameStarted" class="game-start">
          <q-btn color="primary" label="開始遊戲" @click="startGame" />
        </div>
        <div v-else class="game-container">
          <canvas ref="gameCanvas" width="300" height="300" class="game-canvas"></canvas>
          <div class="game-stats">
            <div>分數: {{ score }}</div>
            <q-btn color="warning" label="暫停/繼續" @click="togglePause" size="sm" class="q-mr-sm" />
            <q-btn color="negative" label="重新開始" @click="resetGame" size="sm" />
          </div>
        </div>
      </div>
      
      <div class="secret-quotes">
        <h3>神秘格言</h3>
        <div class="quote-box">
          {{ randomQuote }}
        </div>
        <q-btn color="accent" label="換一句" @click="getNewQuote" />
      </div>
      
      <div class="return-home">
        <q-btn to="/" color="negative" label="返回首頁" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getQuote } from 'src/data/quotes'

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
  randomQuote.value = getQuote()
  
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
  randomQuote.value = getQuote()
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
    { x: 130, y: 150 }
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
    y: Math.floor(Math.random() * (gameCanvas.value.height / cellSize)) * cellSize
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
  ctx.fillStyle = '#f0f0f0'
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
  
  // 繪製食物
  ctx.fillStyle = '#e74c3c'
  ctx.fillRect(food.x, food.y, cellSize, cellSize)
  
  // 繪製蛇
  snake.forEach((segment, index) => {
    if (index === 0) {
      // 蛇頭
      ctx.fillStyle = '#2ecc71'
    } else {
      // 蛇身
      ctx.fillStyle = '#27ae60'
    }
    ctx.fillRect(segment.x, segment.y, cellSize, cellSize)
    
    // 添加邊框
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1
    ctx.strokeRect(segment.x, segment.y, cellSize, cellSize)
  })
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
}

.easter-egg-content {
  max-width: 800px;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: fadeIn 1.2s ease-out;
}

.egg-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
}

.egg-description {
  font-size: 1.3rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 3rem;
}

.snake-game {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 15px;
}

.game-instructions {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.game-canvas {
  border: 2px solid #2c3e50;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.game-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.game-start {
  margin: 1rem 0;
}

.secret-quotes {
  margin-bottom: 2rem;
}

.quote-box {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 15px;
  margin: 1rem 0;
  font-style: italic;
  color: #555;
}

.return-home {
  margin-top: 2rem;
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

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style> 