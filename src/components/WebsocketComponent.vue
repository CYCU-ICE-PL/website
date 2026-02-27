<template>
  <div>
    <slot
      :isConnected="isConnected"
      :sendMessage="sendMessage"
      :connect="connect"
      :disconnect="disconnect"
      :connecting="connecting"
    ></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue'

const emit = defineEmits(['message', 'connected', 'disconnected'])

const isConnected = ref(false)
const connecting = ref(false)
let socket: WebSocket | null = null
let connection_generation = 0

const sendMessage = (message: string) => {
  if (isConnected.value && socket) {
    socket.send(message)
  }
}

/**
 * Clean up the current socket without emitting events.
 * Nullifies all handlers to prevent stale callbacks from firing.
 */
const cleanupSocket = () => {
  if (socket) {
    try {
      socket.onclose = null
      socket.onerror = null
      socket.onmessage = null
      socket.onopen = null
      socket.close()
    } catch {
      // Ignore errors during cleanup
    }
    socket = null
  }
}

const connect = async (interpreterType: string) => {
  const generation = ++connection_generation
  console.log('interpreterType:', interpreterType)

  // Clean up existing socket to prevent stale callbacks
  cleanupSocket()

  connecting.value = true
  await nextTick()
  const wsUrl = `wss://pl-tmp.ja-errorpro.codes/`
  socket = new WebSocket(wsUrl)

  const timeoutId = setTimeout(() => {
    if (generation !== connection_generation) return
    if (!isConnected.value) {
      cleanupSocket()
      connecting.value = false
    }
  }, 3000) // 3秒超時

  socket.onopen = () => {
    if (generation !== connection_generation) return // Stale callback, ignore
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
    if (generation !== connection_generation) return // Stale callback, ignore
    clearTimeout(timeoutId)
    console.log('WebSocket connection closed')
    isConnected.value = false
    connecting.value = false
    emit('disconnected')
  }

  socket.onerror = (error) => {
    if (generation !== connection_generation) return // Stale callback, ignore
    clearTimeout(timeoutId)
    console.error('WebSocket error:', error)
    connecting.value = false
  }

  socket.onmessage = (event) => {
    if (generation !== connection_generation) return // Stale callback, ignore
    console.log('WebSocket message received:', event.data)
    emit('message', event.data)
  }
}

const disconnect = () => {
  connection_generation++ // Invalidate all pending callbacks from old sockets
  cleanupSocket()
  isConnected.value = false
  connecting.value = false
  emit('disconnected')
}

onUnmounted(() => {
  connection_generation++ // Prevent callbacks after unmount
  cleanupSocket()
})
</script>
