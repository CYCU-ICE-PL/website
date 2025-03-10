<template>
  <WebSocketComponent v-slot="{ isConnected: wsConnected, sendMessage, connect, disconnect, connecting }"
    @message="updateOutput" @connected="handleConnected" @disconnected="handleDisconnected">
    <q-page class="q-pa-sm">
      <div class="row q-col-gutter-md" style="text-align: center">
        <div class="col-12">
          
          <q-btn-group push>
            <q-btn v-for="option in interpreterOptions" :key="option" :label="option" @click="() => { currentProject = option; connect(`OurScheme${option}`); }" :disable="isInterpreterTypeLocked || connecting" :color="currentProject === option && wsConnected ? 'green' : 'grey'" style="text-transform: none;">
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
          
          <div class="col-12">
            <q-input filled v-model="code" label="輸入程式碼" type="textarea" autogrow class="q-mt-md" :spellcheck="false"
              :disable="!wsConnected || executing">
              <template v-slot:before>
                <template v-if="!executing">
                  <q-btn v-if="wsConnected" icon="play_arrow" @click="sendCode(sendMessage)" color="green" round
                    size="md">
                    <q-tooltip anchor="bottom middle" self="top middle"> 送出 </q-tooltip>
                  </q-btn>
                </template>
                <q-spinner v-else color="grey" size="xs" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="col-6">
          <TextArea :initialText="input" :title="inputTitle" @update:text="updateInput" />
        </div>
        <div class="col-6">
          <TextArea :initialText="output" :title="outputTitle" readonly />
        </div>
      </div>
    </q-page>
  </WebSocketComponent>
</template>

<script setup>
import { ref } from 'vue'
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

const interpreterOptions = ['project1', 'project2', 'project3', 'project4']

const sendCode = async (sendMessage) => {
  executing.value = true
  code.value += '\n' // 添加換行符
  input.value += code.value
  const message = {
    interpreterType: `OurScheme${currentProject.value}`,
    payload: code.value,
  }
  sendMessage(JSON.stringify(message))
  gtag('event', 'execute_code', {
    event_category: 'Code Execution',
    event_label: `OurScheme${currentProject.value}`,
  })
  code.value = '' // 清空輸入程式碼
  setTimeout(() => {
    executing.value = false
  }, 1000) // 模擬執行完成後的狀態變更
}

const updateInput = (newInput) => {
  input.value = newInput
}

const updateOutput = (message) => {
  output.value += message // 將 WebSocket 回傳的訊息添加到 output
}

const lockInterpreterType = () => {
  isInterpreterTypeLocked.value = true
}

const unlockInterpreterType = () => {
  isInterpreterTypeLocked.value = false
}

const clearInputOutput = () => {
  input.value = ''
  output.value = ''
}

const handleConnected = () => {
  lockInterpreterType()
  clearInputOutput()
  input.value = '1\n' // 初始化輸入
  $q.notify({
    type: 'positive',
    message: '連線成功',
    timeout: 1200,
    position: 'top',
    progress: true,
  })
}

const handleDisconnected = () => {
  unlockInterpreterType()
  currentProject.value = ''
  $q.notify({
    type: 'warning',
    message: '連線中斷',
    timeout: 1200,
    position: 'top',
    progress: true,
    icon: 'warning'
  })
}
</script>