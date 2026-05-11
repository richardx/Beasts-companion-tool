import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { defineStore } from 'pinia'

export const useSpellFilters = defineStore('spellFilters', () => {
  const levels = useStorage('spell:levels', [])
  const categories = useStorage('spell:categories', [])
  const concentration = useStorage('spell:concentration', false)
  const ritual = useStorage('spell:ritual', false)

  const hasActiveFilters = computed(
    () => levels.value.length > 0 || categories.value.length > 0 || concentration.value || ritual.value,
  )

  const predicate = computed(() => (spell) => {
    if (levels.value.length > 0 && !levels.value.includes(spell.level)) return false
    if (categories.value.length > 0 && !categories.value.some((c) => spell.categories.includes(c))) return false
    if (concentration.value && !spell.concentration) return false
    if (ritual.value && !spell.ritual) return false
    return true
  })

  const toggleLevel = (level) => {
    const idx = levels.value.indexOf(level)
    if (idx === -1) levels.value.push(level)
    else levels.value.splice(idx, 1)
  }

  const toggleCategory = (cat) => {
    const idx = categories.value.indexOf(cat)
    if (idx === -1) categories.value.push(cat)
    else categories.value.splice(idx, 1)
  }

  const reset = () => {
    levels.value = []
    categories.value = []
    concentration.value = false
    ritual.value = false
  }

  return { levels, categories, concentration, ritual, hasActiveFilters, predicate, toggleLevel, toggleCategory, reset }
})
