<template>
  <q-dialog v-model="open" position="right" :maximized="false" class="history-dialog">
    <q-card class="history-card">
      <q-toolbar class="history-toolbar">
        <q-icon name="history" size="sm" class="q-mr-sm" />
        <q-toolbar-title>歷史紀錄</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="delete_sweep"
          :disable="entries.length === 0"
          @click="confirmClear"
        >
          <q-tooltip>清空全部</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="close" v-close-popup>
          <q-tooltip>關閉</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-separator />

      <div v-if="entries.length === 0" class="empty-state">
        <q-icon name="inbox" size="48px" class="empty-icon" />
        <div class="text-subtitle2 q-mt-sm">尚無歷史紀錄</div>
        <div class="text-caption text-grey-7 q-mt-xs">送出程式碼後會自動保存</div>
      </div>

      <q-scroll-area v-else class="history-scroll">
        <q-list separator>
          <q-item
            v-for="entry in entries"
            :key="entry.id"
            clickable
            class="history-item"
            @click="loadEntry(entry)"
          >
            <q-item-section>
              <q-item-label class="history-title">
                <span v-if="entry.title">{{ entry.title }}</span>
                <span v-else class="text-grey-8">{{ entry.preview || '(空白)' }}</span>
              </q-item-label>
              <q-item-label caption class="history-meta">
                <q-badge :color="languageColor(entry.language)" class="q-mr-xs">
                  {{ entry.project }}
                </q-badge>
                <span class="text-grey-7">{{ formatTime(entry.timestamp) }}</span>
              </q-item-label>
              <q-item-label caption class="history-preview">
                {{ truncate(entry.code, 120) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <div class="row no-wrap q-gutter-xs">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="edit"
                  @click.stop="startRename(entry)"
                >
                  <q-tooltip>重新命名</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="delete"
                  color="negative"
                  @click.stop="onRemove(entry.id)"
                >
                  <q-tooltip>刪除</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import type { HistoryEntry } from 'src/composables/useHistory'

const open = defineModel<boolean>({ default: false })

const props = defineProps<{
  entries: HistoryEntry[]
}>()

const emit = defineEmits<{
  load: [entry: HistoryEntry]
  remove: [id: string]
  rename: [id: string, title: string]
  clear: []
}>()

const $q = useQuasar()

const loadEntry = (entry: HistoryEntry) => {
  emit('load', entry)
  open.value = false
}

const onRemove = (id: string) => {
  emit('remove', id)
}

const startRename = (entry: HistoryEntry) => {
  $q.dialog({
    title: '重新命名',
    message: '請輸入新名稱',
    prompt: {
      model: entry.title ?? '',
      type: 'text',
      isValid: (val: string) => val.length <= 60,
    },
    cancel: true,
    persistent: false,
  }).onOk((newTitle: string) => {
    emit('rename', entry.id, newTitle)
  })
}

const confirmClear = () => {
  $q.dialog({
    title: '清空歷史紀錄',
    message: `確定要刪除全部 ${props.entries.length} 筆紀錄嗎？此動作無法復原。`,
    ok: { label: '清空', color: 'negative' },
    cancel: true,
  }).onOk(() => {
    emit('clear')
  })
}

const languageColor = (lang: 'scheme' | 'c') => (lang === 'c' ? 'deep-orange' : 'indigo')

const truncate = (text: string, len: number) => {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  return collapsed.length > len ? collapsed.slice(0, len) + '…' : collapsed
}

const formatTime = (ts: number) => {
  const diff = Date.now() - ts
  const min = 60_000
  const hr = 60 * min
  const day = 24 * hr
  if (diff < min) return '剛剛'
  if (diff < hr) return `${Math.floor(diff / min)} 分鐘前`
  if (diff < day) return `${Math.floor(diff / hr)} 小時前`
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`
  return new Date(ts).toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
</script>

<style scoped>
.history-card {
  width: 380px;
  max-width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
}

body.body--dark .history-card {
  background: rgba(30, 30, 30, 0.98);
  color: rgba(255, 255, 255, 0.87);
}

@media (max-width: 599px) {
  .history-card {
    width: 100vw;
  }
}

.history-toolbar {
  background: linear-gradient(90deg, rgba(139, 157, 195, 0.12), rgba(107, 123, 156, 0.08));
  min-height: 48px;
  flex: 0 0 auto;
}

.history-scroll {
  flex: 1 1 auto;
  min-height: 0;
}

.history-item {
  transition: background 0.15s ease;
}

.history-item:hover {
  background: rgba(139, 157, 195, 0.08);
}

.history-title {
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.history-meta {
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.history-preview {
  margin-top: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.78rem;
  color: rgba(0, 0, 0, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

body.body--dark .history-preview {
  color: rgba(255, 255, 255, 0.5);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: rgba(0, 0, 0, 0.55);
}

body.body--dark .empty-state {
  color: rgba(255, 255, 255, 0.55);
}

.empty-icon {
  opacity: 0.4;
}
</style>
