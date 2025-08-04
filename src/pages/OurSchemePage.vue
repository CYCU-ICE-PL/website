<template>
  <WebSocketComponent
    v-slot="{ isConnected: wsConnected, sendMessage, connect, disconnect, connecting }"
    @message="updateOutput"
    @connected="handleConnected"
    @disconnected="handleDisconnected"
  >
    <q-page class="page-container">
      <div class="scheme-container">
        <!-- 頂部控制區域 -->
        <div class="control-section q-mb-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col">
              <q-btn-group v-if="!$q.screen.lt.sm" push spread>
                <q-btn
                  v-for="option in interpreterOptions"
                  :key="option"
                  :label="option"
                  @click="() => handleProjectChange(option, connect, disconnect, wsConnected)"
                  :disable="connecting"
                  :color="currentProject === option && wsConnected ? 'green' : 'grey'"
                  class="project-btn"
                >
                  <template v-if="connecting && currentProject === option">
                    <q-spinner size="md" color="primary" />
                  </template>
                  <template v-else>
                    <q-tooltip anchor="bottom right" self="top middle">
                      {{
                        wsConnected && currentProject === option
                          ? `已連線到 ${option}`
                          : `切換到 ${option}`
                      }}
                    </q-tooltip>
                  </template>
                </q-btn>
              </q-btn-group>
              <!-- 小螢幕顯示 -->
              <q-btn-dropdown
                v-else
                :label="currentProject || '選擇專案'"
                :color="wsConnected ? 'green' : 'grey'"
                :disable="connecting"
                class="full-width"
              >
                <q-list>
                  <q-item
                    v-for="option in interpreterOptions"
                    :key="option"
                    clickable
                    v-close-popup
                    @click="() => handleProjectChange(option, connect, disconnect, wsConnected)"
                    :active="currentProject === option"
                  >
                    <q-item-section>
                      <q-item-label>{{ option }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div class="col-auto">
              <q-btn-group flat>
                <q-btn
                  :color="activeTab === 'io' ? 'primary' : 'grey'"
                  icon="input"
                  @click="activeTab = 'io'"
                  class="toggle-btn"
                >
                  <q-tooltip>Input & Output</q-tooltip>
                </q-btn>
                <q-btn
                  :color="activeTab === 'interaction' ? 'primary' : 'grey'"
                  icon="history"
                  @click="activeTab = 'interaction'"
                  class="toggle-btn"
                >
                  <q-tooltip>交互紀錄</q-tooltip>
                </q-btn>
                <q-btn icon="download" @click="exportFiles" class="toggle-btn">
                  <q-tooltip>匯出檔案</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </div>
        </div>

        <!-- Tab 內容區域 -->
        <q-tab-panels v-model="activeTab" animated>
          <!-- Input & Output 面板 -->
          <q-tab-panel name="io">
            <div class="row q-col-gutter-md">
              <!-- 輸入區域 -->
              <div class="col-6">
                <TextArea :initialText="input" :title="inputTitle" @update:text="updateInput" />
              </div>

              <!-- 輸出區域 -->
              <div class="col-6">
                <TextArea :initialText="output" :title="outputTitle" readonly />
              </div>
            </div>
          </q-tab-panel>

          <!-- 交互紀錄面板 -->
          <q-tab-panel name="interaction">
            <q-card class="interaction-card">
              <q-card-section>
                <div class="text-h6 q-mb-md">
                  交互紀錄
                  <q-badge color="pink" class="q-ml-sm"> Preview </q-badge>
                </div>
                <q-input filled v-model="interactionLog" type="textarea" autogrow readonly />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>

        <!-- 程式碼編輯區域 -->
        <q-card class="code-editor-card q-mt-md">
          <q-card-section class="code-editor-section">
            <div class="text-caption text-grey-7 q-mb-sm">
              <q-icon name="keyboard" size="xs" class="q-mr-xs" />
              Enter 送出程式碼 | Shift + Enter 插入換行
            </div>
            <div class="code-input-container">
              <q-input
                filled
                v-model="code"
                type="textarea"
                autogrow
                :spellcheck="false"
                :disable="!wsConnected"
                class="code-input"
                label="請在此輸入程式碼"
                @keydown.enter.prevent="(event) => handleEnterKey(event, sendMessage)"
              />
              <q-btn
                color="green"
                icon="send"
                class="send-btn"
                :disable="!wsConnected || executing"
                @click="() => sendCode(sendMessage)"
              >
                <q-tooltip>送出程式碼</q-tooltip>
                <template v-if="executing">
                  <q-spinner size="sm" color="white" />
                </template>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </WebSocketComponent>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import TextArea from 'components/TextArea.vue'
import WebSocketComponent from 'components/WebsocketComponent.vue'

const $q = useQuasar()

const code = ref('')
const output = ref('')
const input = ref('')
const inputTitle = ref('Input')
const outputTitle = ref('Output')
const isInterpreterTypeLocked = ref(false)
const executing = ref(false)
const currentProject = ref('')
const interactionLog = ref('') // 交互紀錄狀態
const interpreterOptions = ['project1', 'project2', 'project3', 'project4']
const sendlock = ref(false)
const activeTab = ref('io') // 新增 tab 狀態
const pendingLines = ref([]) // 待處理的程式碼行
const isReady = ref(true) // 是否準備好接收下一行
const currentSendMessage = ref(null) // 儲存當前的 sendMessage 函數
const wsConnected = ref(false) // 新增 WebSocket 連線狀態

const handleProjectChange = async (project, connect, disconnect, isConnected) => {
  if (currentProject.value === project) return

  if (isConnected) {
    await disconnect()
    // 等待斷開連接完成
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  currentProject.value = project
  // 根據選擇的專案決定要連接到哪個專案
  if (project === 'project234') {
    // 隨機選擇一個專案
    const projects = ['project2', 'project3', 'project4']
    const randomProject = projects[Math.floor(Math.random() * projects.length)]
    connect(`OurScheme${randomProject}`)
  } else {
    connect(`OurScheme${project}`)
  }
}

const sendCode = async (sendMessage) => {
  if (!wsConnected.value || executing.value) return

  executing.value = true
  isReady.value = true // 確保初始狀態是 ready
  currentSendMessage.value = sendMessage
  const lines = code.value.split('\n')
  pendingLines.value = lines
  code.value = '' // 清空程式碼編輯器

  if (isReady.value) {
    await processNextLine()
  }
}

const processNextLine = async () => {
  if (pendingLines.value.length === 0) {
    executing.value = false
    isReady.value = true
    return
  }

  isReady.value = false
  const line = pendingLines.value[0]

  input.value += line + '\n'

  const message = {
    interpreterType:
      currentProject.value === 'project234'
        ? `OurScheme${['project2', 'project3', 'project4'][Math.floor(Math.random() * 3)]}`
        : `OurScheme${currentProject.value}`,
    payload: line + '\n',
  }

  if (typeof currentSendMessage.value === 'function') {
    currentSendMessage.value(JSON.stringify(message))
  } else {
    console.error('sendMessage is not available')
    executing.value = false
    isReady.value = true
    return
  }

  interactionLog.value += `${line}\n`
  pendingLines.value.shift()
}

const updateInput = (newInput) => {
  input.value = newInput
}

const updateOutput = (message) => {
  try {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.type === 'ready') {
      isReady.value = true
      if (pendingLines.value.length > 0) {
        processNextLine()
      } else {
        executing.value = false
        isReady.value = true
      }
      return
    } else if (parsedMessage.type === 'ack') {
      // 如果是空 payload 的 ack，忽略它
      if (!parsedMessage.payload) {
        return
      }
      // 其他 ack 訊息也忽略，讓 ready 訊息來處理狀態
      return
    }
  } catch {
    // 如果不是 JSON 格式，則為一般輸出
    output.value += message
    interactionLog.value += `${message}`
  }
}

const lockInterpreterType = () => {
  isInterpreterTypeLocked.value = true
}

const unlockInterpreterType = () => {
  isInterpreterTypeLocked.value = false
}

const clearInputOutput = () => {
  code.value = ''
  input.value = ''
  output.value = ''
  interactionLog.value = ''
}

const handleConnected = () => {
  sendlock.value = false
  lockInterpreterType()
  clearInputOutput()
  input.value = '1\n' // 初始化輸入 (TestNumber)
  interactionLog.value = '1\n' // 初始化交互紀錄
  isReady.value = true // 初始化 ready 狀態
  pendingLines.value = [] // 清空待處理的行
  wsConnected.value = true // 更新連線狀態
  $q.notify({
    type: 'positive',
    message: '連線成功',
    timeout: 1200,
    position: 'top',
    progress: true,
  })
}

const handleDisconnected = () => {
  sendlock.value = true
  unlockInterpreterType()
  currentProject.value = ''
  isReady.value = false // 重置 ready 狀態
  pendingLines.value = [] // 清空待處理的行
  currentSendMessage.value = null // 重置 sendMessage
  wsConnected.value = false // 更新連線狀態
  $q.notify({
    type: 'warning',
    message: '連線中斷',
    timeout: 1200,
    position: 'top',
    progress: true,
    icon: 'warning',
  })
}

const handleEnterKey = (event, sendMessage) => {
  if (event.shiftKey) {
    // 如果是 Shift + Enter，插入換行
    const textarea = event.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    code.value = code.value.substring(0, start) + '\n' + code.value.substring(end)

    // 將游標移到新行的開始位置
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1
    })
  } else {
    // 如果是單純的 Enter，送出程式碼
    if (!wsConnected.value || executing.value) return
    if (typeof sendMessage === 'function') {
      sendCode(sendMessage)
    } else {
      console.error('sendMessage is not available')
    }
  }
}

const exportFiles = () => {
  const timestamp = new Date()
    .toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/[/\s:]/g, '-')

  // 匯出 .in 檔案
  const inBlob = new Blob([input.value], { type: 'text/plain' })
  const inUrl = URL.createObjectURL(inBlob)
  const inLink = document.createElement('a')
  inLink.href = inUrl
  inLink.download = `input_${timestamp}.in`
  document.body.appendChild(inLink)
  inLink.click()
  document.body.removeChild(inLink)
  URL.revokeObjectURL(inUrl)

  // 匯出 .out 檔案
  const outBlob = new Blob([output.value], { type: 'text/plain' })
  const outUrl = URL.createObjectURL(outBlob)
  const outLink = document.createElement('a')
  outLink.href = outUrl
  outLink.download = `output_${timestamp}.out`
  document.body.appendChild(outLink)
  outLink.click()
  document.body.removeChild(outLink)
  URL.revokeObjectURL(outUrl)

  // 匯出交互紀錄
  const logBlob = new Blob([interactionLog.value], { type: 'text/plain' })
  const logUrl = URL.createObjectURL(logBlob)
  const logLink = document.createElement('a')
  logLink.href = logUrl
  logLink.download = `interaction_log_${timestamp}.txt`
  document.body.appendChild(logLink)
  logLink.click()
  document.body.removeChild(logLink)
  URL.revokeObjectURL(logUrl)

  $q.notify({
    type: 'positive',
    message: '檔案匯出成功',
    timeout: 1200,
    position: 'top',
    progress: true,
  })
}
</script>

<style scoped>
.page-container {
  padding: 16px;
  animation: fadeIn 0.5s ease-out;
}

@media (max-width: 599px) {
  .page-container {
    padding: 0;
  }
}

.scheme-container {
  max-width: 1200px;
  margin: 0 auto;
}

.control-section {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

@media (max-width: 599px) {
  .control-section {
    padding: 0.25rem 0;
  }
}

.code-editor-card,
.interaction-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.code-editor-card::before,
.interaction-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8b9dc3, #6b7b9c);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.code-editor-card:hover::before,
.interaction-card:hover::before {
  opacity: 1;
}

.code-editor-card:hover,
.interaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.project-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 80px;
  height: 36px;
  font-size: 0.9rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
}

.project-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3));
  transform: translateY(-1px);
}

.project-btn:active {
  transform: translateY(0) scale(0.98);
}

.project-btn .q-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #8b9dc3;
}

.project-btn .q-btn__content {
  position: relative;
  z-index: 1;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

:deep(.q-btn-group) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

:deep(.q-btn-group .q-btn) {
  flex: 1;
  min-width: 80px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

:deep(.q-btn-group .q-btn::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.q-btn-group .q-btn:hover::before) {
  transform: translateX(100%);
}

:deep(.q-btn-group:hover) {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

:deep(.q-btn) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.q-btn:not(:last-child)) {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.q-btn--active) {
  position: relative;
  z-index: 1;
  background: linear-gradient(45deg, rgba(139, 157, 195, 0.2), rgba(107, 123, 156, 0.2));
}

:deep(.q-btn--active::after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(139, 157, 195, 0.3), rgba(107, 123, 156, 0.3));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.q-btn--active:hover::after) {
  opacity: 0.5;
}

.toggle-btn {
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.98);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toggle-btn:active {
  transform: translateY(0) scale(0.98);
}

.code-input-container {
  position: relative;
  display: flex;
  gap: 8px;
}

.code-input {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 1rem;
}

.send-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.95);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(135deg, #cccccc 0%, #999999 100%);
}

@media (max-width: 599px) {
  .send-btn {
    width: 36px;
    height: 36px;
    right: 12px;
    bottom: 12px;
  }
}

.text-caption {
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-grey-7 {
  color: rgba(0, 0, 0, 0.7);
}

:deep(.text-area-container) {
  height: 100%;
  min-height: 200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 157, 195, 0.2);
}

:deep(.text-area-container:hover) {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(139, 157, 195, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.text-area-title) {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 599px) {
  :deep(.text-area-container) {
    min-height: 150px;
  }

  :deep(.text-area-title) {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
}

/* 新增動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 新增滾動條樣式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 157, 195, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 157, 195, 0.5);
}
</style>
