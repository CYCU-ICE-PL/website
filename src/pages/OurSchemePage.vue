<template>
  <WebSocketComponent v-slot="{ isConnected: wsConnected, sendMessage, connect, disconnect, connecting }"
    @message="updateOutput" @connected="handleConnected" @disconnected="handleDisconnected">
    <q-page class="q-pa-sm">
      <div class="row q-col-gutter-md" style="text-align: center">
        <div class="col-12">
          
          <q-btn-group push>
            <q-btn v-for="option in interpreterOptions" :key="option" :label="option" @click="() => { currentProject = option; connect(`OurScheme${option}`); }" :disable="isInterpreterTypeLocked || connecting" :color="currentProject === option ? 'green' : 'grey'" style="text-transform: none;">
              <q-tooltip anchor="bottom right" self="top middle">
                {{ wsConnected && currentProject === option ? `已成功連線到 ${option}` : `選擇 ${option}` }}
              </q-tooltip>
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
                  <q-btn v-if="wsConnected" icon="play_arrow" @click="executeCode(sendMessage)" color="green" round
                    size="md">
                    <q-tooltip anchor="bottom middle" self="top middle"> 執行程式碼 </q-tooltip>
                  </q-btn>
                </template>
                <q-spinner v-else color="grey" size="xs" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  :icon="generateTree ? 'visibility' : 'visibility_off'"
                  :color="generateTree ? 'green' : 'grey'"
                  @click="generateTree = !generateTree"
                  size="sm"
                >
                  <q-tooltip anchor="bottom middle" self="top middle">
                    {{ generateTree ? '已開啟可視化分析' : '已關閉可視化分析' }}
                  </q-tooltip>
                </q-btn>
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
const interpreterType = ref('')
const isInterpreterTypeLocked = ref(false)
const executing = ref(false)
const dialogVisible = ref(false)
const parseTree = ref('')
const generateTree = ref(false)
const currentProject = ref('')

const interpreterOptions = ['project1', 'project2', 'project3', 'project4']

const executeCode = async (sendMessage) => {
  executing.value = true
  code.value += '\n' // 添加換行符
  input.value += code.value
  const message = {
    interpreterType: `OurScheme${interpreterType.value}`,
    payload: code.value,
  }
  sendMessage(JSON.stringify(message))
  gtag('event', 'execute_code', {
    event_category: 'Code Execution',
    event_label: `OurScheme${interpreterType.value}`,
  })
  if (generateTree.value) {
    await sendPostRequest()
  }
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

const sendPostRequest = async () => {
  try {
    const response = await axios.post(`https://visualpl.lab214b.uk:5001/syntax-tree`, {
      payload: code.value + '\n',
      interpreterType: `OurScheme${interpreterType.value}`
    })
    if (response.status !== 200) {
      throw new Error('請檢查輸入是否正確')
    }
    parseTree.value = response.data.parseTree
    dialogVisible.value = true
    gtag('event', 'visualize_syntax_tree', {
      event_category: 'Syntax Tree',
      event_label: `OurScheme${interpreterType.value}`,
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