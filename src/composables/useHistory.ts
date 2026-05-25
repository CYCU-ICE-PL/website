import { ref, computed } from 'vue'

export type HistoryLanguage = 'scheme' | 'c'

export interface HistoryEntry {
  id: string
  code: string
  project: string
  language: HistoryLanguage
  timestamp: number
  preview: string
  title?: string
}

const STORAGE_KEY = 'pl-visualize:history:v1'
const MAX_ENTRIES = 50

const entries = ref<HistoryEntry[]>([])
let loaded = false

const loadFromStorage = () => {
  if (loaded) return
  loaded = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as HistoryEntry[]
    if (Array.isArray(parsed)) {
      entries.value = parsed.filter(
        (e) => typeof e?.code === 'string' && typeof e?.timestamp === 'number',
      )
    }
  } catch {
    entries.value = []
  }
}

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  } catch {
    // localStorage unavailable or full; ignore silently
  }
}

const makeId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useHistory = (filterLanguage?: HistoryLanguage) => {
  loadFromStorage()

  const visibleEntries = computed(() => {
    if (!filterLanguage) return entries.value
    return entries.value.filter((e) => e.language === filterLanguage)
  })

  const add = (input: { code: string; project: string; language: HistoryLanguage }) => {
    const code = input.code.replace(/\s+$/, '')
    if (!code.trim()) return
    const last = entries.value[0]
    if (last && last.code === code && last.project === input.project) return

    const newEntry: HistoryEntry = {
      id: makeId(),
      code,
      project: input.project,
      language: input.language,
      timestamp: Date.now(),
      preview: code.split('\n')[0]?.slice(0, 80) ?? '',
    }
    entries.value = [newEntry, ...entries.value].slice(0, MAX_ENTRIES)
    persist()
  }

  const remove = (id: string) => {
    entries.value = entries.value.filter((e) => e.id !== id)
    persist()
  }

  const clear = () => {
    entries.value = []
    persist()
  }

  const rename = (id: string, title: string) => {
    const entry = entries.value.find((e) => e.id === id)
    if (!entry) return
    entry.title = title.trim() || undefined
    entries.value = [...entries.value]
    persist()
  }

  return { entries: visibleEntries, add, remove, clear, rename }
}
