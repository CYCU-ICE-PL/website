<template>
  <div ref="editorContainer" class="code-editor-cm" :class="{ 'is-disabled': disabled }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useQuasar } from 'quasar'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, placeholder as placeholderExt } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { StreamLanguage, bracketMatching, syntaxHighlighting, defaultHighlightStyle, foldGutter, foldKeymap } from '@codemirror/language'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { cpp } from '@codemirror/lang-cpp'
import { scheme } from '@codemirror/legacy-modes/mode/scheme'
import { oneDark } from '@codemirror/theme-one-dark'

type Language = 'scheme' | 'c'

const props = withDefaults(
  defineProps<{
    modelValue: string
    language: Language
    disabled?: boolean
    placeholder?: string
    minHeight?: string
  }>(),
  {
    disabled: false,
    placeholder: '請在此輸入程式碼',
    minHeight: '200px',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

const $q = useQuasar()
const editorContainer = ref<HTMLElement | null>(null)
let view: EditorView | null = null

const languageCompartment = new Compartment()
const themeCompartment = new Compartment()
const editableCompartment = new Compartment()

const getLanguageExtension = (lang: Language) =>
  lang === 'c' ? cpp() : StreamLanguage.define(scheme)

const getThemeExtension = (dark: boolean) => (dark ? oneDark : [])

const buildExtensions = () => [
  lineNumbers(),
  highlightActiveLineGutter(),
  history(),
  foldGutter(),
  drawSelection(),
  EditorState.tabSize.of(4),
  bracketMatching(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  EditorView.lineWrapping,
  placeholderExt(props.placeholder),
  keymap.of([
    {
      key: 'Enter',
      run: () => {
        emit('submit')
        return true
      },
    },
    {
      key: 'Shift-Enter',
      run: (cmView) => {
        cmView.dispatch(cmView.state.replaceSelection('\n'))
        return true
      },
    },
    {
      key: 'Tab',
      run: (cmView) => {
        cmView.dispatch(cmView.state.replaceSelection('\t'))
        return true
      },
    },
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
  ]),
  EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      emit('update:modelValue', update.state.doc.toString())
    }
  }),
  languageCompartment.of(getLanguageExtension(props.language)),
  themeCompartment.of(getThemeExtension($q.dark.isActive)),
  editableCompartment.of(EditorView.editable.of(!props.disabled)),
]

onMounted(() => {
  if (!editorContainer.value) return
  view = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: buildExtensions(),
    }),
    parent: editorContainer.value,
  })
})

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (!view) return
    const current = view.state.doc.toString()
    if (current === newVal) return
    view.dispatch({
      changes: { from: 0, to: current.length, insert: newVal },
    })
  },
)

watch(
  () => props.language,
  (newLang) => {
    view?.dispatch({
      effects: languageCompartment.reconfigure(getLanguageExtension(newLang)),
    })
  },
)

watch(
  () => $q.dark.isActive,
  (dark) => {
    view?.dispatch({
      effects: themeCompartment.reconfigure(getThemeExtension(dark)),
    })
  },
)

watch(
  () => props.disabled,
  (disabled) => {
    view?.dispatch({
      effects: editableCompartment.reconfigure(EditorView.editable.of(!disabled)),
    })
  },
)

defineExpose({
  focus: () => view?.focus(),
})
</script>

<style scoped>
.code-editor-cm {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  transition: border-color 0.2s ease, opacity 0.2s ease;
}

body.body--dark .code-editor-cm {
  background: rgba(30, 30, 30, 0.95);
  border-color: rgba(255, 255, 255, 0.15);
}

.code-editor-cm:focus-within {
  border-color: rgba(139, 157, 195, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 157, 195, 0.15);
}

.code-editor-cm.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.cm-editor) {
  height: auto;
  max-height: 500px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 599px) {
  :deep(.cm-editor) {
    max-height: 300px;
    font-size: 13px;
  }
}

:deep(.cm-scroller) {
  overflow: auto;
  font-family: inherit;
}

:deep(.cm-content) {
  min-height: v-bind(minHeight);
  padding: 8px 0;
}

:deep(.cm-gutters) {
  background: rgba(0, 0, 0, 0.03);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.5);
}

body.body--dark :deep(.cm-gutters) {
  background: rgba(255, 255, 255, 0.03);
  border-right-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
}

:deep(.cm-focused) {
  outline: none;
}

:deep(.cm-activeLine) {
  background: rgba(139, 157, 195, 0.08);
}

:deep(.cm-activeLineGutter) {
  background: rgba(139, 157, 195, 0.12);
}

body.body--dark :deep(.cm-activeLine) {
  background: rgba(139, 157, 195, 0.12);
}

body.body--dark :deep(.cm-activeLineGutter) {
  background: rgba(139, 157, 195, 0.18);
}
</style>
