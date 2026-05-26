<template>
  <q-card
    class="diff-card"
    :class="{ 'diff-card--dragging': isDragging }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div v-if="isDragging" class="drop-overlay">
      <q-icon name="cloud_upload" size="64px" />
      <div class="text-h6 q-mt-sm">放開以載入你的輸出檔案</div>
      <div class="text-caption q-mt-xs">支援 .out / .txt / .log</div>
    </div>
    <q-card-section>
      <div class="diff-header q-mb-md">
        <div class="text-h6 diff-title">
          <q-icon name="compare_arrows" class="q-mr-xs" />
          輸出比對
          <q-badge color="pink" class="q-ml-sm">Preview</q-badge>
        </div>
        <div class="diff-actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="upload_file"
            :label="userOutput ? '更換你的輸出' : '載入你的輸出'"
            class="upload-btn"
            :class="{ 'upload-btn--pulse': !userOutput }"
            @click="triggerUpload"
          >
            <q-tooltip>點擊選檔，或直接把檔案拖到此卡片</q-tooltip>
          </q-btn>
          <input
            ref="fileInput"
            type="file"
            accept=".out,.txt,.log,text/plain"
            style="display: none"
            @change="onFileChange"
          />
          <q-btn-toggle
            v-model="viewMode"
            :options="[
              { label: '並排', value: 'split' },
              { label: '統一', value: 'unified' },
            ]"
            unelevated
            dense
            no-caps
            color="grey-4"
            text-color="grey-9"
            toggle-color="primary"
            toggle-text-color="white"
          />
          <q-btn
            v-if="userOutput"
            flat
            dense
            round
            icon="close"
            color="negative"
            @click="clearUserOutput"
          >
            <q-tooltip>清除上傳檔案</q-tooltip>
          </q-btn>
        </div>
      </div>

      <div v-if="!userOutput" class="empty-hint" @click="triggerUpload">
        <q-icon name="cloud_upload" size="56px" class="empty-icon" />
        <div class="text-subtitle1 q-mt-sm text-weight-medium">尚未上傳你的輸出</div>
        <div class="text-caption text-grey-7 q-mt-xs">
          點擊上方「載入你的輸出」按鈕、點此區塊、或將檔案直接拖曳到這裡，
          上傳你的直譯器產生的 <code>.out</code> 檔案，
          與此頁面的 PL 系統輸出（期望輸出）逐行比對。
        </div>
      </div>

      <template v-else>
        <div class="diff-stats q-mb-sm">
          <q-badge color="positive" class="q-mr-sm">
            <q-icon name="check" size="xs" class="q-mr-xs" />
            一致 {{ stats.same }} 行
          </q-badge>
          <q-badge :color="stats.extra > 0 ? 'negative' : 'grey'" class="q-mr-sm">
            <q-icon name="add" size="xs" class="q-mr-xs" />
            多餘 {{ stats.extra }} 行
          </q-badge>
          <q-badge :color="stats.missing > 0 ? 'orange' : 'grey'" class="q-mr-sm">
            <q-icon name="remove" size="xs" class="q-mr-xs" />
            缺少 {{ stats.missing }} 行
          </q-badge>
          <q-badge v-if="firstDivergence !== null" color="warning">
            你的輸出首次差異於第 {{ firstDivergence }} 行
          </q-badge>
          <q-badge v-else color="positive">
            <q-icon name="verified" size="xs" class="q-mr-xs" />
            完全一致
          </q-badge>
        </div>

        <div v-if="viewMode === 'split'" class="diff-split">
          <div class="diff-pane">
            <div class="diff-pane-header">
              <q-icon name="upload_file" size="xs" class="q-mr-xs" />
              你的輸出
            </div>
            <div class="diff-pane-body">
              <div
                v-for="(row, i) in splitRows"
                :key="`a-${i}`"
                class="diff-row"
                :class="row.aClass"
              >
                <span class="diff-lineno">{{ row.aLine ?? '' }}</span>
                <span class="diff-text">{{ row.aText ?? '' }}</span>
              </div>
            </div>
          </div>
          <div class="diff-pane">
            <div class="diff-pane-header">
              <q-icon name="verified" size="xs" class="q-mr-xs" />
              期望輸出 (PL 系統)
            </div>
            <div class="diff-pane-body">
              <div
                v-for="(row, i) in splitRows"
                :key="`b-${i}`"
                class="diff-row"
                :class="row.bClass"
              >
                <span class="diff-lineno">{{ row.bLine ?? '' }}</span>
                <span class="diff-text">{{ row.bText ?? '' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="diff-unified">
          <div
            v-for="(line, i) in unifiedLines"
            :key="i"
            class="diff-row"
            :class="`diff-${line.kind}`"
          >
            <span class="diff-marker">{{ markerOf(line.kind) }}</span>
            <span class="diff-text">{{ line.text }}</span>
          </div>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { diffArrays } from 'diff'

const props = defineProps<{
  expected: string
}>()

const $q = useQuasar()
const userOutput = ref<string>('')
const userFileName = ref<string>('')
const viewMode = ref<'split' | 'unified'>('split')
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
// dragenter/dragleave fire for every nested child element. Counting enter/leave events
// is the standard trick to know when the cursor has truly left the container.
let dragDepth = 0

const triggerUpload = () => fileInput.value?.click()

const loadFile = async (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    $q.notify({ type: 'negative', message: '檔案過大 (>5MB)', timeout: 1500, position: 'top' })
    return
  }
  try {
    const text = await file.text()
    // Normalize line endings: Windows-generated .out files use CRLF; bare CR for old Mac.
    // The expected output (from the WebSocket) is LF only, so without this every line diffs.
    userOutput.value = text.replace(/\r\n?/g, '\n')
    userFileName.value = file.name
    $q.notify({
      type: 'positive',
      message: `已載入：${file.name}`,
      timeout: 1200,
      position: 'top',
      progress: true,
    })
  } catch {
    $q.notify({ type: 'negative', message: '讀取檔案失敗', timeout: 1500, position: 'top' })
  }
}

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) await loadFile(file)
  target.value = ''
}

const hasFiles = (e: DragEvent) =>
  Array.from(e.dataTransfer?.types ?? []).includes('Files')

const onDragEnter = (e: DragEvent) => {
  if (!hasFiles(e)) return
  dragDepth++
  isDragging.value = true
}

const onDragOver = (e: DragEvent) => {
  if (!hasFiles(e)) return
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
}

const onDragLeave = (e: DragEvent) => {
  if (!hasFiles(e)) return
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) isDragging.value = false
}

const onDrop = async (e: DragEvent) => {
  dragDepth = 0
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await loadFile(file)
}

const clearUserOutput = () => {
  userOutput.value = ''
  userFileName.value = ''
}

const splitLines = (text: string): string[] => {
  if (text === '') return []
  // Defensive: in case CRLF slips in from the expected side too.
  const normalized = text.replace(/\r\n?/g, '\n')
  const parts = normalized.split('\n')
  if (parts.length > 0 && parts[parts.length - 1] === '') parts.pop()
  return parts
}

type DiffChunk = { value: string[]; added?: boolean; removed?: boolean }

// diffArrays(old, new): "removed" = in old (yours) but not in new (expected) → extra in yours
//                      "added"   = in new (expected) but not in old (yours) → missing from yours
const chunks = computed<DiffChunk[]>(() => {
  if (!userOutput.value && !props.expected) return []
  return diffArrays(splitLines(userOutput.value), splitLines(props.expected)) as DiffChunk[]
})

const stats = computed(() => {
  let same = 0
  let extra = 0
  let missing = 0
  for (const c of chunks.value) {
    if (c.removed) extra += c.value.length
    else if (c.added) missing += c.value.length
    else same += c.value.length
  }
  return { same, extra, missing }
})

interface SplitRow {
  aLine: number | null
  bLine: number | null
  aText: string | null
  bText: string | null
  aClass: string
  bClass: string
}

const splitRows = computed<SplitRow[]>(() => {
  const rows: SplitRow[] = []
  let aLine = 1
  let bLine = 1
  const queue = [...chunks.value]

  while (queue.length > 0) {
    const chunk = queue.shift()!
    if (chunk.added) {
      // Expected-only: missing from your output
      for (const line of chunk.value) {
        rows.push({
          aLine: null,
          aText: null,
          aClass: 'diff-empty',
          bLine: bLine++,
          bText: line,
          bClass: 'diff-missing',
        })
      }
    } else if (chunk.removed) {
      // Your-only: extra in your output. Pair with next added if possible for inline alignment.
      const next = queue[0]
      if (next?.added) {
        queue.shift()
        const pairLen = Math.min(chunk.value.length, next.value.length)
        for (let i = 0; i < pairLen; i++) {
          rows.push({
            aLine: aLine++,
            aText: chunk.value[i] ?? null,
            aClass: 'diff-extra',
            bLine: bLine++,
            bText: next.value[i] ?? null,
            bClass: 'diff-missing',
          })
        }
        for (let i = pairLen; i < chunk.value.length; i++) {
          rows.push({
            aLine: aLine++,
            aText: chunk.value[i] ?? null,
            aClass: 'diff-extra',
            bLine: null,
            bText: null,
            bClass: 'diff-empty',
          })
        }
        for (let i = pairLen; i < next.value.length; i++) {
          rows.push({
            aLine: null,
            aText: null,
            aClass: 'diff-empty',
            bLine: bLine++,
            bText: next.value[i] ?? null,
            bClass: 'diff-missing',
          })
        }
      } else {
        for (const line of chunk.value) {
          rows.push({
            aLine: aLine++,
            aText: line,
            aClass: 'diff-extra',
            bLine: null,
            bText: null,
            bClass: 'diff-empty',
          })
        }
      }
    } else {
      for (const line of chunk.value) {
        rows.push({
          aLine: aLine++,
          aText: line,
          aClass: 'diff-same',
          bLine: bLine++,
          bText: line,
          bClass: 'diff-same',
        })
      }
    }
  }
  return rows
})

interface UnifiedLine {
  kind: 'same' | 'extra' | 'missing'
  text: string
}

const unifiedLines = computed<UnifiedLine[]>(() => {
  const out: UnifiedLine[] = []
  for (const c of chunks.value) {
    const kind: UnifiedLine['kind'] = c.removed ? 'extra' : c.added ? 'missing' : 'same'
    for (const line of c.value) out.push({ kind, text: line })
  }
  return out
})

const firstDivergence = computed<number | null>(() => {
  // Find first line in user's output that does not match — counted in user-output line numbers.
  let yourLine = 0
  for (const c of chunks.value) {
    if (c.removed) return yourLine + 1
    if (c.added) return yourLine + 1
    yourLine += c.value.length
  }
  return null
})

const markerOf = (kind: UnifiedLine['kind']) =>
  kind === 'extra' ? '+' : kind === 'missing' ? '-' : ' '
</script>

<style scoped>
.diff-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  transition:
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
}

body.body--dark .diff-card {
  background: rgba(30, 30, 30, 0.98);
  border-color: rgba(255, 255, 255, 0.1);
}

.diff-card--dragging {
  border-color: var(--q-primary, #1976d2);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.18), 0 12px 36px rgba(25, 118, 210, 0.2);
}

.drop-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(25, 118, 210, 0.08);
  backdrop-filter: blur(2px);
  border: 2px dashed var(--q-primary, #1976d2);
  border-radius: 16px;
  color: var(--q-primary, #1976d2);
  pointer-events: none;
  animation: dropPulse 1.2s ease-in-out infinite;
}

body.body--dark .drop-overlay {
  background: rgba(25, 118, 210, 0.18);
}

@keyframes dropPulse {
  0%, 100% { opacity: 0.92; }
  50% { opacity: 1; }
}

.upload-btn {
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 4px 14px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
}

.upload-btn--pulse {
  animation: uploadPulse 2.2s ease-in-out infinite;
}

@keyframes uploadPulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3), 0 0 0 0 rgba(25, 118, 210, 0.45);
  }
  50% {
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3), 0 0 0 8px rgba(25, 118, 210, 0);
  }
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  text-align: center;
  color: rgba(0, 0, 0, 0.55);
  border: 2px dashed rgba(25, 118, 210, 0.35);
  border-radius: 12px;
  background: rgba(25, 118, 210, 0.04);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.empty-hint:hover {
  background: rgba(25, 118, 210, 0.08);
  border-color: rgba(25, 118, 210, 0.6);
}

.empty-hint:active {
  transform: scale(0.995);
}

body.body--dark .empty-hint {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(25, 118, 210, 0.08);
  border-color: rgba(120, 170, 230, 0.35);
}

body.body--dark .empty-hint:hover {
  background: rgba(25, 118, 210, 0.14);
  border-color: rgba(120, 170, 230, 0.6);
}

.empty-icon {
  opacity: 0.55;
  color: var(--q-primary, #1976d2);
}

.empty-hint code {
  background: rgba(0, 0, 0, 0.06);
  padding: 0 4px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
}

.diff-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  row-gap: 8px;
}

.diff-title {
  flex: 1 1 auto;
  min-width: 0;
}

.diff-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

@media (max-width: 599px) {
  .diff-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

.diff-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.diff-stats .q-badge {
  padding: 4px 8px;
  font-size: 0.78rem;
}

.diff-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  max-height: 60vh;
}

@media (max-width: 599px) {
  .diff-split {
    grid-template-columns: 1fr;
    max-height: none;
  }

  .diff-pane + .diff-pane {
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  body.body--dark .diff-pane + .diff-pane {
    border-top-color: rgba(255, 255, 255, 0.12);
  }

  .diff-pane-body {
    max-height: 35vh;
  }
}

body.body--dark .diff-split {
  border-color: rgba(255, 255, 255, 0.12);
}

.diff-pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.diff-pane + .diff-pane {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

body.body--dark .diff-pane + .diff-pane {
  border-left-color: rgba(255, 255, 255, 0.12);
}

.diff-pane-header {
  background: rgba(139, 157, 195, 0.12);
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
}

body.body--dark .diff-pane-header {
  background: rgba(139, 157, 195, 0.18);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.diff-pane-body {
  flex: 1;
  overflow: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.55;
}

.diff-unified {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: auto;
  max-height: 60vh;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.85rem;
  line-height: 1.55;
}

body.body--dark .diff-unified {
  border-color: rgba(255, 255, 255, 0.12);
}

.diff-row {
  display: flex;
  align-items: baseline;
  padding: 1px 8px;
  white-space: pre;
  min-height: 1.55em;
}

.diff-lineno {
  display: inline-block;
  min-width: 38px;
  text-align: right;
  padding-right: 10px;
  color: rgba(0, 0, 0, 0.4);
  user-select: none;
  font-variant-numeric: tabular-nums;
}

body.body--dark .diff-lineno {
  color: rgba(255, 255, 255, 0.35);
}

.diff-marker {
  display: inline-block;
  width: 18px;
  text-align: center;
  user-select: none;
  font-weight: 700;
}

.diff-text {
  white-space: pre-wrap;
  word-break: break-all;
}

.diff-same {
  background: transparent;
}

/* "extra" = lines present in your output but not in expected → wrong/extra in yours */
.diff-extra {
  background: rgba(244, 67, 54, 0.18);
}

.diff-extra .diff-marker {
  color: #c62828;
}

/* "missing" = lines present in expected but not in your output → missing from yours */
.diff-missing {
  background: rgba(255, 152, 0, 0.2);
}

.diff-missing .diff-marker {
  color: #e65100;
}

.diff-empty {
  background: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.02) 6px,
    rgba(0, 0, 0, 0.05) 6px,
    rgba(0, 0, 0, 0.05) 12px
  );
}

body.body--dark .diff-empty {
  background: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.02) 6px,
    rgba(255, 255, 255, 0.05) 6px,
    rgba(255, 255, 255, 0.05) 12px
  );
}
</style>
