<template>
  <div class="filter-bar">
    <!-- Søg -->
    <div class="fb-search">
      <Search class="search-ico" />
      <input
        v-model="store.q"
        type="text"
        placeholder="Søg …"
        class="search-input"
        aria-label="Søg efter beasts"
      />
      <button v-if="store.q" class="clear-btn" @click="store.q = ''" aria-label="Ryd søgning">
        <X class="ico-sm" />
      </button>
    </div>

    <!-- CR range -->
    <div class="fb-cr">
      <span class="fb-label">CR</span>
      <div class="cr-widget">
        <div class="slider-track">
          <div class="slider-fill" :style="fillStyle" />
        </div>
        <input
          type="range"
          v-model.number="store.crMin"
          :min="0"
          :max="8"
          :step="0.25"
          class="cr-slider cr-min"
          @input="() => { if (store.crMin > store.crMax) store.crMax = store.crMin }"
        />
        <input
          type="range"
          v-model.number="store.crMax"
          :min="0"
          :max="8"
          :step="0.25"
          class="cr-slider cr-max"
          @input="() => { if (store.crMax < store.crMin) store.crMin = store.crMax }"
        />
      </div>
      <span class="cr-badge">{{ store.crMin }}─{{ store.crMax }}</span>
    </div>

    <!-- Bevægelse chips -->
    <div class="fb-chips">
      <button
        v-for="m in movementTypes"
        :key="m.key"
        class="chip"
        :class="{ active: store.moves.includes(m.key) }"
        type="button"
        @click="store.toggleMove(m.key)"
      >
        <component :is="m.icon" class="chip-ico" />
        <span>{{ m.label }}</span>
      </button>
    </div>

    <!-- Senses pills -->
    <div class="fb-senses">
      <button
        v-for="s in senseTypes"
        :key="s"
        class="pill"
        :class="{ active: store.senses.includes(s) }"
        type="button"
        @click="store.toggleSense(s)"
      >
        {{ formatSenseName(s) }}
      </button>
    </div>

    <!-- Nulstil -->
    <button v-if="hasActiveFilters" class="reset-btn" @click="store.reset()" title="Nulstil alle filtre">
      <RotateCcw class="ico-sm" />
    </button>
  </div>
</template>

<script setup>
import { useFilters } from '@/stores/useFilters'
import { Droplet, Footprints, RotateCcw, Search, Wind, X } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useFilters()

const movementTypes = [
  { key: 'fly', label: 'Fly', icon: Wind },
  { key: 'swim', label: 'Swim', icon: Droplet },
  { key: 'burrow', label: 'Burrow', icon: Footprints },
  { key: 'climb', label: 'Climb', icon: Footprints },
]

const senseTypes = ['blindsight', 'darkvision', 'tremorsense']

const formatSenseName = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const hasActiveFilters = computed(
  () => store.q || store.crMin > 0 || store.crMax < 6 || store.moves.length > 0 || store.senses.length > 0,
)

const fillStyle = computed(() => ({
  left: `${(store.crMin / 8) * 100}%`,
  width: `${((store.crMax - store.crMin) / 8) * 100}%`,
}))
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

/* ── Søg ── */
.fb-search {
  position: relative;
  flex: 1;
  min-width: 160px;
  max-width: 280px;
}

.search-ico {
  position: absolute;
  left: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.9rem;
  height: 0.9rem;
  color: #525252;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.45rem 2rem 0.45rem 2rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.8125rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #dc2626;
}

.search-input::placeholder {
  color: #525252;
}

.clear-btn {
  position: absolute;
  right: 0.375rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #525252;
  border-radius: 0.25rem;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #ffffff;
}

/* ── CR ── */
.fb-cr {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.fb-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #737373;
  white-space: nowrap;
}

.cr-widget {
  position: relative;
  width: 100px;
  height: 20px;
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  height: 4px;
  background: #262626;
  border-radius: 2px;
}

.slider-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
  border-radius: 2px;
}

.cr-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.cr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid #dc2626;
  border-radius: 50%;
  cursor: grab;
  pointer-events: all;
  transition: transform 0.15s;
}

.cr-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.cr-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid #dc2626;
  border-radius: 50%;
  cursor: grab;
  pointer-events: all;
}

.cr-min {
  z-index: 3;
}

.cr-max {
  z-index: 2;
}

.cr-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  background: #dc2626;
  padding: 0.1rem 0.45rem;
  border-radius: 1rem;
  white-space: nowrap;
}

/* ── Chips ── */
.fb-chips {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
}

.chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
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
  background: #dc26261a;
  border-color: #dc2626;
  color: #ffffff;
}

.chip-ico {
  width: 0.875rem;
  height: 0.875rem;
}

/* ── Senses ── */
.fb-senses {
  display: flex;
  gap: 0.375rem;
  flex-shrink: 0;
}

.pill {
  padding: 0.375rem 0.625rem;
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
  background: #737373;
  border-color: #737373;
  color: #ffffff;
}

/* ── Reset ── */
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
  border-color: #dc2626;
  color: #dc2626;
}

.ico-sm {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
