<template>
  <div class="filter-bar">
    <!-- Niveau-chips -->
    <div class="fb-group">
      <span class="fb-label">Level</span>
      <div class="fb-chips">
        <button
          v-for="l in levelOptions"
          :key="l.value"
          class="chip"
          :class="{ active: store.levels.includes(l.value) }"
          type="button"
          @click="store.toggleLevel(l.value)"
        >
          {{ l.label }}
        </button>
      </div>
    </div>

    <div class="separator" />

    <!-- Kategori-chips -->
    <div class="fb-group">
      <span class="fb-label">Category</span>
      <div class="fb-chips">
        <button
          v-for="cat in categoryOptions"
          :key="cat.value"
          class="chip"
          :class="{ active: store.categories.includes(cat.value) }"
          type="button"
          @click="store.toggleCategory(cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div class="separator" />

    <!-- Toggle-pills -->
    <div class="fb-chips">
      <button
        class="pill"
        :class="{ active: store.concentration }"
        type="button"
        @click="store.concentration = !store.concentration"
      >
        Concentration
      </button>
      <button
        class="pill"
        :class="{ active: store.ritual }"
        type="button"
        @click="store.ritual = !store.ritual"
      >
        Ritual
      </button>
    </div>

    <!-- Reset -->
    <button v-if="store.hasActiveFilters" class="reset-btn" @click="store.reset()" title="Reset filters">
      <RotateCcw class="ico-sm" />
    </button>
  </div>
</template>

<script setup>
import { useSpellFilters } from '@/stores/useSpellFilters'
import { RotateCcw } from 'lucide-vue-next'

const store = useSpellFilters()

const levelOptions = [
  { value: 0, label: 'Cantrip' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
]

const categoryOptions = [
  { value: 'damage', label: 'Damage' },
  { value: 'support', label: 'Support' },
  { value: 'control', label: 'Control' },
  { value: 'utility', label: 'Utility' },
]
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding: 0.75rem 2rem;
  background: #0d0d0d;
  border-bottom: 1px solid #1a1a1a;
}

.fb-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fb-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #737373;
  white-space: nowrap;
}

.separator {
  width: 1px;
  height: 1.25rem;
  background: #262626;
  flex-shrink: 0;
}

.fb-chips {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.chip {
  padding: 0.375rem 0.625rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #a3a3a3;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.chip:hover {
  background: #262626;
  border-color: #404040;
  color: #ffffff;
}

.chip.active {
  background: #f59e0b1a;
  border-color: #f59e0b;
  color: #fde68a;
}

.pill {
  padding: 0.375rem 0.75rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 2rem;
  color: #a3a3a3;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.pill:hover {
  background: #262626;
  border-color: #404040;
  color: #ffffff;
}

.pill.active {
  background: #f59e0b1a;
  border-color: #f59e0b;
  color: #fde68a;
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  background: transparent;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #737373;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.reset-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.ico-sm {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
