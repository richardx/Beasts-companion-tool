<template>
  <aside class="notes-panel" :class="{ open: isOpen }" :style="isOpen ? { width: panelWidth + 'px' } : {}">
    <!-- Drag handle (only visible when open) -->
    <div v-if="isOpen" class="resize-handle" @mousedown="startResize" />

    <button
      class="toggle-btn"
      @click="isOpen = !isOpen"
      :title="isOpen ? 'Skjul noter' : 'Vis noter'"
      :aria-label="isOpen ? 'Skjul noter' : 'Vis noter'"
    >
      <PenLine class="toggle-ico" />
      <span v-if="isOpen" class="toggle-label">Kamp&shy;noter</span>
    </button>

    <div v-if="isOpen" class="notes-body">
      <textarea
        v-model="notes"
        class="notes-textarea"
        placeholder="Skriv dine noter her…"
        spellcheck="false"
      />
      <button v-if="notes" class="clear-btn" @click="notes = ''">Ryd</button>
    </div>
  </aside>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { PenLine } from 'lucide-vue-next'

const isOpen = useStorage('notes-open', false)
const notes = useStorage('combat-notes', '')
const panelWidth = useStorage('notes-width', 280)

const MIN_WIDTH = 180
const MAX_WIDTH = 600

function startResize(e) {
  e.preventDefault()
  const startX = e.clientX
  const startWidth = panelWidth.value

  function onMouseMove(e) {
    const delta = startX - e.clientX
    panelWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta))
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.notes-panel {
  width: 44px;
  flex-shrink: 0;
  background: #0f0f0f;
  border-left: 1px solid #262626;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.25s ease;
}

.notes-panel.open {
  width: 280px;
  transition: none; /* disable transition while dragging */
}

.resize-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle:hover,
.resize-handle:active {
  background: #dc262644;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1.1rem 0.75rem;
  background: none;
  border: none;
  border-bottom: 1px solid #262626;
  color: #737373;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-btn:hover {
  color: #ffffff;
}

.notes-panel.open .toggle-btn {
  color: #dc2626;
}

.toggle-ico {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.toggle-label {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.notes-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
  overflow: hidden;
}

.notes-textarea {
  flex: 1;
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #e5e5e5;
  font-size: 0.8125rem;
  line-height: 1.6;
  padding: 0.75rem;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.notes-textarea:focus {
  outline: none;
  border-color: #dc2626;
}

.notes-textarea::placeholder {
  color: #404040;
}

.clear-btn {
  padding: 0.4rem;
  background: transparent;
  border: 1px solid #262626;
  border-radius: 0.375rem;
  color: #525252;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.clear-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}
</style>
