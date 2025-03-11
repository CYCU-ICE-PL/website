<template>
  <WebSocketComponent
    v-slot="{ isConnected: wsConnected, sendMessage, connect, disconnect, connecting }"
    @message="updateOutput"
    @connected="handleConnected"
    @disconnected="handleDisconnected"
  >
    <q-page class="q-pa-sm">
      <div class="row q-col-gutter-md" style="text-align: center">
        <div class="col-12">
          <q-btn-group push>
            <q-btn
              v-for="option in interpreterOptions"
              :key="option"
              :label="option"
              @click="() => { currentProject = option; connect(`OurScheme${option}`); }"
              :disable="isInterpreterTypeLocked || connecting"
              :color="currentProject === option && wsConnected ? 'green' : 'grey'"
              style="text-transform: none;"
            >
              <template v-if="connecting && currentProject === option">
                <q-spinner size="md" color="primary" />
              </template>
              <template v-else>
                <q-tooltip anchor="bottom right" self="top middle">
                  {{ wsConnected && currentProject === option ? `已成功連線到 ${option}` : `選擇 ${option}` }}
                </q-tooltip>
              </template>
            </q-btn>
            <q-btn v-if="wsConnected" icon="link_off" @click="disconnect" color="red">
              <q-tooltip anchor="bottom right" self="top middle"> 斷開連線 </q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <div class="col-12">
          <q-input
            filled
            v-model="code"
            label="輸入程式碼"
            type="textarea"
            autogrow
            class="q-mt-md"
            :spellcheck="false"
            :disable="!wsConnected || executing"
          />
        </div>

        <div class="col-6">
          <TextArea :initialText="input" :title="inputTitle" @update:text="updateInput" />
        </div>
        <div class="col-6">
          <TextArea :initialText="output" :title="outputTitle" readonly />
        </div>
      </div>

      <div style="max-width: 500px;">
        <q-badge color="pink" label="Preview⬇️" />
        <q-expansion-item icon="history" label="交互紀錄">
          <q-input filled v-model="interactionLog" type="textarea" autogrow readonly />
        </q-expansion-item>
      </div>

      <q-page-sticky position="bottom-right" style="margin-top: 20px;">
        <q-fab ref="fab" icon="settings" active-icon="close" direction="left" color="primary" :active="true">
          <q-fab-action icon="delete" @click="confirmClearInputOutput" color="grey">
            <q-tooltip anchor="bottom middle" self="top middle"> 清除 </q-tooltip>
          </q-fab-action>
          <q-fab-action v-if="wsConnected">
            <q-slider
              v-model="waitTime"
              :min="50"
              :max="1000"
              :step="50"
              label
              :label-value="'送出間隔時間 ' + waitTime + 'ms'"
              style="width: 50px;"
            />
          </q-fab-action>
          <template v-if="!executing">
            <q-fab-action v-if="wsConnected" icon="send" @click="sendCode(sendMessage)" color="green">
              <q-tooltip anchor="bottom middle" self="top middle"> 送出 </q-tooltip>
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
    code.value = code.value.replace(line + '\n', ''); // 移除已發送的訊息
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

const confirmClearInputOutput = () => {
  $q.dialog({
    title: '確認',
    message: '您確定要清除所有輸入和輸出嗎？',
    ok: {
      label: '確定',
      color: 'red',
    },
    cancel: {
      label: '取消',
      color: 'primary',
    },
  }).onOk(() => {
    clearInputOutput();
  });
};
</script>
