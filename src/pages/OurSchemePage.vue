<template>
  <WebSocketComponent
    v-slot="{ isConnected: wsConnected, sendMessage, connect, disconnect, connecting }"
    @message="updateOutput"
    @connected="handleConnected"
    @disconnected="handleDisconnected"
  >
    <q-page class="q-pa-md">
      <div class="scheme-container">
        <!-- 頂部控制區域 -->
        <div class="control-section q-mb-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col">
              <q-btn-group push spread>
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
                      {{ wsConnected && currentProject === option ? `已連線到 ${option}` : `切換到 ${option}` }}
                    </q-tooltip>
                  </template>
                </q-btn>
              </q-btn-group>
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
              <div class="col-12 col-md-6">
                <TextArea :initialText="input" :title="inputTitle" @update:text="updateInput" />
              </div>

              <!-- 輸出區域 -->
              <div class="col-12 col-md-6">
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
                  <q-badge color="pink" class="q-ml-sm">
                    Preview⬇️
                    <q-tooltip>間隔時間低於50ms可能會得到錯誤的交互結果</q-tooltip>
                  </q-badge>
                </div>
                <q-input filled v-model="interactionLog" type="textarea" autogrow readonly />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>

        <!-- 程式碼編輯區域 -->
        <q-card class="code-editor-card q-mt-md">
          <q-card-section>
            <q-input
              filled
              v-model="code"
              type="textarea"
              autogrow
              :spellcheck="false"
              :disable="!wsConnected || executing"
              class="code-input"
              label="請在此輸入程式碼"
            />
          </q-card-section>
        </q-card>

        <!-- 浮動操作按鈕 -->
        <q-page-sticky position="bottom-right">
          <q-fab ref="fab" icon="settings" active-icon="close" direction="left" color="primary" :active="true">
            <template v-if="!executing">
              <q-fab-action v-if="wsConnected" icon="send" @click="sendCode(sendMessage)" color="green">
                <q-tooltip anchor="bottom middle" self="top middle">送出</q-tooltip>
              </q-fab-action>
              <q-fab-action
                v-else
                icon="hourglass_empty"
                color="grey"
                @click="
                  () =>
                    $q.notify({
                      type: 'warning',
                      message: '請先選擇 project',
                      timeout: 1200,
                      position: 'top',
                      progress: true,
                      icon: 'warning',
                    })
                "
              />
            </template>
            <q-fab-action v-else icon="hourglass_empty" color="grey" />
          </q-fab>
        </q-page-sticky>
      </div>
    </q-page>
  </WebSocketComponent>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import TextArea from 'components/TextArea.vue';
import WebSocketComponent from 'components/WebsocketComponent.vue';

const $q = useQuasar();

const code = ref('');
const output = ref('');
const input = ref('');
const inputTitle = ref('Input');
const outputTitle = ref('Output');
const isInterpreterTypeLocked = ref(false);
const executing = ref(false);
const fab = ref(null);
const currentProject = ref('');
const interactionLog = ref(''); // 交互紀錄狀態
const interpreterOptions = ['project1', 'project2', 'project3', 'project4'];
const sendlock = ref(false);
const activeTab = ref('io'); // 新增 tab 狀態
const pendingLines = ref([]); // 待處理的程式碼行
const isReady = ref(true); // 是否準備好接收下一行
const currentSendMessage = ref(null); // 儲存當前的 sendMessage 函數

const handleProjectChange = async (project, connect, disconnect, wsConnected) => {
  if (currentProject.value === project) return;
  
  if (wsConnected) {
    await disconnect();
    // 等待斷開連接完成
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  currentProject.value = project;
  connect(`OurScheme${project}`);
};

const sendCode = async (sendMessage) => {
  executing.value = true;
  currentSendMessage.value = sendMessage; // 儲存 sendMessage 函數
  const lines = code.value.split('\n').filter(line => line.trim() !== ''); // 過濾空行
  pendingLines.value = lines;
  code.value = ''; // 清空程式碼編輯器
  
  // 如果已經準備好，開始處理第一行
  if (isReady.value) {
    await processNextLine();
  }
};

const processNextLine = async () => {
  if (pendingLines.value.length === 0) {
    executing.value = false;
    fab.value.show();
    return;
  }

  isReady.value = false;
  const line = pendingLines.value[0];
  
  // 更新輸入區域
  input.value += line + '\n';
  
  // 準備訊息
  const message = {
    interpreterType: `OurScheme${currentProject.value}`,
    payload: line + '\n',
  };
  
  // 發送訊息
  currentSendMessage.value(JSON.stringify(message));
  
  // 更新交互紀錄
  interactionLog.value += `${line}\n`;
  
  // 移除已處理的行
  pendingLines.value.shift();
};

const updateInput = (newInput) => {
  input.value = newInput;
};

const updateOutput = (message) => {
  try {
    // 嘗試解析訊息
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'ready') {
      // 後端準備好接收下一行
      isReady.value = true;
      // 如果還有待處理的行，處理下一行
      if (pendingLines.value.length > 0) {
        processNextLine();
      }
      return;
    }
  } catch {
    // 如果不是 JSON 格式，則為一般輸出
    output.value += message;
    interactionLog.value += `${message}`;
  }
};

const lockInterpreterType = () => {
  isInterpreterTypeLocked.value = true;
};

const unlockInterpreterType = () => {
  isInterpreterTypeLocked.value = false;
};

const clearInputOutput = () => {
  code.value = '';
  input.value = '';
  output.value = '';
  interactionLog.value = '';
};

const handleConnected = () => {
  sendlock.value = false;
  lockInterpreterType();
  clearInputOutput();
  input.value = '1\n'; // 初始化輸入 (TestNumber)
  interactionLog.value = '1\n'; // 初始化交互紀錄
  isReady.value = true; // 初始化 ready 狀態
  pendingLines.value = []; // 清空待處理的行
  currentSendMessage.value = null; // 重置 sendMessage
  fab.value.show();
  $q.notify({
    type: 'positive',
    message: '連線成功',
    timeout: 1200,
    position: 'top',
    progress: true,
  });
};

const handleDisconnected = () => {
  sendlock.value = true;
  unlockInterpreterType();
  currentProject.value = '';
  isReady.value = false; // 重置 ready 狀態
  pendingLines.value = []; // 清空待處理的行
  currentSendMessage.value = null; // 重置 sendMessage
  $q.notify({
    type: 'warning',
    message: '連線中斷',
    timeout: 1200,
    position: 'top',
    progress: true,
    icon: 'warning',
  });
};
</script>

<style scoped>
.scheme-container {
  max-width: 1200px;
  margin: 0 auto;
}

.control-section {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.code-editor-card,
.interaction-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
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
  min-width: 100px;
  height: 40px;
}

.project-btn .q-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.project-btn .q-btn__content {
  position: relative;
  z-index: 1;
}

.project-btn::before {
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

.project-btn:hover::before {
  transform: translateX(100%);
}

.project-btn:active {
  transform: scale(0.98);
}

:deep(.q-btn-group) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
}

:deep(.q-btn-group .q-btn) {
  flex: 1;
  min-width: 100px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
}

:deep(.q-btn--active::after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
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
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.code-input {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 1.1rem;
  line-height: 1.6;
}

:deep(.q-card__section) {
  padding: 1.5rem;
}

:deep(.q-input__control) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.q-input__control:hover) {
  background: rgba(255, 255, 255, 0.95);
}

:deep(.q-fab) {
  background: linear-gradient(135deg, #8b9dc3 0%, #6b7b9c 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.q-fab-action) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.q-fab-action:hover) {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.q-badge) {
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

:deep(.q-tooltip) {
  background: rgba(44, 62, 80, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

:deep(.q-tab-panels) {
  background: transparent;
}
</style>
