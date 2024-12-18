<template>
  <WebSocketComponent v-slot="{ isConnected: wsConnected, sendMessage, connect, disconnect, connecting }"
    @message="updateOutput" @connected="handleConnected" @disconnected="handleDisconnected">
    <q-page class="q-pa-sm">
      <div class="row q-col-gutter-md" style="text-align: center">
        <div class="col-12">
          <q-btn-group push>
            <q-select filled v-model="interpreterType" :options="interpreterOptions" label="文法"
              :disable="isInterpreterTypeLocked">
              <q-tooltip anchor="bottom right" self="top middle"> 選擇Interpreter文法 </q-tooltip>
            </q-select>
            <template v-if="wsConnected">
              <q-btn icon="link_off" @click="disconnect" color="red" round>
                <q-tooltip anchor="bottom middle" self="top middle"> 中斷連線 </q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <q-btn icon="link" @click="() => connect(interpreterType)" color="primary" round v-if="!connecting">
                <q-tooltip anchor="bottom middle" self="top middle"> 連線到Interpreter </q-tooltip>
              </q-btn>
              <q-spinner-tail v-else color="grey" class="q-ma-sm" size="md" />
            </template>
          </q-btn-group>
          <div class="col-12">
            <q-input filled v-model="code" label="輸入程式碼" type="textarea" autogrow class="q-mt-md" :spellcheck="false"
              :disable="!wsConnected || executing">
              <template v-slot:before>
                <template v-if="!executing">
                  <q-btn v-if="wsConnected" icon="play_arrow" @click="executeCode(sendMessage)" color="green" round
                    size="md">
                    <q-tooltip anchor="bottom middle" self="top middle"> 執行程式碼 </q-tooltip>
                  </q-btn>
                  <q-btn v-if="wsConnected" icon="visibility" @click="sendPostRequest" color="blue" round size="md">
                    <q-tooltip anchor="bottom middle" self="top middle"> 可視化分析 </q-tooltip>
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
    <q-dialog v-model="dialogVisible" full-height full-width>
      <q-card flat>
        <ParseTree :parseTree="parseTree" />
        <q-card-actions align="right">
          <q-btn label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </WebSocketComponent>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import TextArea from 'components/TextArea.vue'
import WebSocketComponent from 'components/WebsocketComponent.vue'
import ParseTree from 'components/ParseTree.vue'
import axios from 'axios'

const $q = useQuasar()

const code = ref('')
const output = ref('')
const input = ref('')
const inputTitle = ref('Input')
const outputTitle = ref('Output')
const interpreterType = ref('OurScheme')
const isInterpreterTypeLocked = ref(false)
const executing = ref(false)
const dialogVisible = ref(false)
const parseTree = ref('')

const interpreterOptions = ['OurScheme'] //, 'OurC']  // 可以添加更多的Interpreter文法

const executeCode = (sendMessage) => {
  if (!interpreterType.value) {
    alert('必須選擇一個Interpreter類型')
    return
  }
  executing.value = true
  code.value += '\n' // 添加換行符
  input.value += code.value
  const message = {
    interpreterType: interpreterType.value,
    payload: code.value,
  }
  sendMessage(JSON.stringify(message))
  code.value = '' // 清空輸入程式碼
  gtag('event', 'execute_code', {
    event_category: 'Code Execution',
    event_label: interpreterType.value,
  })
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
  $q.notify({
    type: 'warning',
    message: '連線中斷',
    timeout: 1200,
    position: 'top',
    progress: true,
    icon: 'warning'
  })
}

const sendPostRequest = async () => {
  try {
    const response = await axios.post(`http://localhost:7090/syntax-tree`, {
      payload: code.value + '\n',
      interpreterType: interpreterType.value
    })
    if (response.status !== 200) {
      throw new Error('請檢查輸入是否正確')
    }
    parseTree.value = response.data.parseTree
    dialogVisible.value = true
    gtag('event', 'visualize_syntax_tree', {
      event_category: 'Syntax Tree',
      event_label: interpreterType.value,
    })
  } catch (error) {
    console.error('Error sending POST request:', error)
    $q.notify({
      type: 'negative',
      message: '可視化請求失敗',
      timeout: 1200,
      position: 'top',
      progress: true,
    })
  }
}
</script>