<template>
  <div>
    <slot :isConnected="isConnected" :sendMessage="sendMessage" :connect="connect" :disconnect="disconnect" :connecting="connecting"></slot>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'

const emit = defineEmits(['message', 'connected', 'disconnected'])

const isConnected = ref(false)
const connecting = ref(false)
let socket

const sendMessage = (message) => {
  if (isConnected.value) {
    socket.send(message)
  }
}

const connect = async (interpreterType) => {
  console.log('interpreterType:', interpreterType)
  connecting.value = true
  await nextTick()
  const wsUrl = `wss://visualpl.lab214b.uk:5001/`
  socket = new WebSocket(wsUrl)

  const timeoutId = setTimeout(() => {
    if (!isConnected.value) {
      socket.close()
      connecting.value = false
    }
  }, 3000) // 3秒超時

  socket.onopen = () => {
    clearTimeout(timeoutId)
    console.log('WebSocket connection established')
    isConnected.value = true
    connecting.value = false
    emit('connected')
    
    // 發送 interpreter type
    if (interpreterType) {
      sendMessage(JSON.stringify({ interpreterType: interpreterType, payload: '1\n' })) // 用於讓使用者不必手動輸入testnum
    }
  }

  socket.onclose = () => {
    clearTimeout(timeoutId)
    console.log('WebSocket connection closed')
    isConnected.value = false
    connecting.value = false
    emit('disconnected')
  }

  socket.onerror = (error) => {
    clearTimeout(timeoutId)
    console.error('WebSocket error:', error)
    connecting.value = false
  }

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data)
    emit('message', event.data)
  }
}

const disconnect = () => {
  if (socket) {
    socket.close()
  }
}

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
})
</script>