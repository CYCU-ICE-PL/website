<template>
  <q-card>
    <q-card-section class="tight-card-section">
      <div class="text-subtitle1">{{ title }}</div>
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

watch(() => props.initialText, (newText) => {
  text.value = newText
})
</script>

<style>
.tight-card-section {
  padding: 8px;
}

.text-subtitle1 {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 4px;
}
</style>