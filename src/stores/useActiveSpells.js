import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useActiveSpells = defineStore('activeSpells', () => {
  const pinned = useStorage('spell:pinned', [])

  const isPinned = computed(() => (name) => pinned.value.some((s) => s.name === name))

  const toggle = (spell) => {
    const idx = pinned.value.findIndex((s) => s.name === spell.name)
    if (idx === -1) {
      if (pinned.value.length < 2) pinned.value.push(spell)
    } else {
      pinned.value.splice(idx, 1)
    }
  }

  return { pinned, isPinned, toggle }
})
