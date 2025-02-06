<template>
  <q-card>
    <q-card-section class="tight-card-section">
      <div class="text-h6">{{ title }}</div>
      <q-btn flat round icon="download" size="sm" class="absolute-top-right q-mt-sm q-mr-sm" @click="exportText" />
      <q-input v-model="text" readonly filled autogrow type="textarea" ref="textInput" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialText: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const text = ref(props.initialText)
const textInput = ref(null)

const exportText = () => {
  const blob = new Blob([text.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const extension = props.title.toLowerCase() === 'input' ? 'in' : 'out'
  link.href = url
  link.download = `testcase.${extension}`
  link.click()
  URL.revokeObjectURL(url)
}

watch(() => props.initialText, (newText) => {
  text.value = newText
})

</script>

<style>
.absolute-top-right {
  position: absolute;
  top: 0;
  right: 0;
}

.tight-card-section {
  padding: 8px;
}
</style>