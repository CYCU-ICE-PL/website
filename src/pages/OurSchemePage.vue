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

        <!-- 主要編輯區域 -->
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

        <!-- 程式碼編輯區域 -->
        <q-card class="code-editor-card q-mt-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">程式碼編輯器</div>
            <q-input
              filled
              v-model="code"
              type="textarea"
              autogrow
              :spellcheck="false"
              :disable="!wsConnected || executing"
              class="code-input"
            />
          </q-card-section>
        </q-card>

        <!-- 交互紀錄區域 -->
        <q-card class="interaction-card q-mt-md">
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

        <!-- 浮動操作按鈕 -->
        <q-page-sticky position="bottom-right">
          <q-fab ref="fab" icon="settings" active-icon="close" direction="left" color="primary" :active="true">
            <q-fab-action v-if="wsConnected">
              <q-slider
                v-model="waitTime"
                :min="0"
                :max="1000"
                :step="50"
                label
                :label-value="'送出間隔時間 ' + waitTime + 'ms'"
                style="width: 50px;"
              />
            </q-fab-action>
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
const waitTime = ref(50);
const interactionLog = ref(''); // 交互紀錄狀態
const interpreterOptions = ['project1', 'project2', 'project3', 'project4'];
const sendlock = ref(false);

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
  const lines = code.value.split('\n');

  for (const line of lines) {
    if (sendlock.value === true) {
      break;
    }
    input.value += line + '\n';
    const message = {
      interpreterType: `OurScheme${currentProject.value}`,
      payload: line + '\n',
    };
    sendMessage(JSON.stringify(message));
    interactionLog.value += `${line}\n`; // 記錄發送的訊息
    code.value = code.value.replace(line, ''); // 移除已發送的訊息
    code.value = code.value.replace('\n', ''); // 移除換行符號
    await new Promise((resolve) => setTimeout(resolve, waitTime.value));
  }
  executing.value = false;
  fab.value.show();
};

const updateInput = (newInput) => {
  input.value = newInput;
};

const updateOutput = (message) => {
  output.value += message; // WebSocket 回傳訊息
  interactionLog.value += `${message}`; // 記錄接收訊息
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
</style>
