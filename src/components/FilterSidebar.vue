<template>
  <!-- desktop = sticky sidebar · mobil = slide‑in -->
  <aside
    class="sidebar"
    :class="{ open: panelOpen, collapsed: !sidebarExpanded }"
    @keydown.esc="panelOpen = false"
  >
    <!-- ╭─ HEADER ───────────────╮ -->
    <header class="sb-head">
      <div class="header-title">
        <Filter class="header-icon" />
        <h2>Filtrer</h2>
      </div>
      <button class="icon-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
        <ChevronLeft class="ico" :class="{ 'rotate-180': !sidebarExpanded }" />
      </button>
    </header>

    <!-- ╭─ ACTIVE FILTERS SUMMARY ─────╮ -->
    <div v-if="activeFiltersCount > 0 && sidebarExpanded" class="active-filters">
      <span class="active-count">{{ activeFiltersCount }} aktive filtre</span>
      <button class="clear-link" @click="clearAllFilters">Ryd alle</button>
    </div>

    <!-- COLLAPSED STATE CONTENT -->
    <div v-if="!sidebarExpanded" class="collapsed-content">
      <button
        v-for="m in movementTypes"
        :key="m.key + '-collapsed'"
        class="collapsed-btn"
        :class="{ active: store.moves.includes(m.key) }"
        type="button"
        @click="store.toggleMove(m.key)"
        :title="m.label"
      >
        <component :is="m.icon" class="ico" />
      </button>

      <div class="collapsed-divider" />

      <button
        class="collapsed-btn"
        :class="{ active: store.senses.length > 0 }"
        @click="sidebarExpanded = true"
        title="Senses"
      >
        <Eye class="ico" />
      </button>

      <button
        v-if="activeFiltersCount > 0"
        class="collapsed-btn reset"
        @click="clearAllFilters"
        title="Ryd alle filtre"
      >
        <RotateCcw class="ico-sm" />
      </button>
    </div>

    <!-- EXPANDED CONTENT -->
    <template v-else>
      <!-- ╭─ SØG ─────────────────────────╮ -->
      <div class="sb-group">
        <div class="sb-label">
          <Search class="label-icon" />
          Søg
        </div>
        <div class="search-wrapper">
          <Search class="search-icon" />
          <input
            v-model="store.q"
            type="text"
            class="search-input"
            placeholder="Navn, keyword …"
            aria-label="Søg efter beasts"
          />
          <button
            v-if="store.q"
            @click="store.q = ''"
            class="clear-search"
            aria-label="Ryd søgning"
          >
            <X class="ico-sm" />
          </button>
        </div>
      </div>

      <!-- ╭─ CR SLIDER ───────────────────╮ -->
      <div class="sb-group">
        <div class="sb-label">
          <Zap class="label-icon" />
          Challenge Rating
          <span class="cr-range">{{ store.crMin }} - {{ store.crMax }}</span>
        </div>

        <div class="range-slider-container">
          <input
            type="range"
            v-model.number="store.crMin"
            :min="0"
            :max="8"
            :step="0.25"
            class="cr-slider cr-slider-min"
            @input="
              () => {
                if (store.crMin > store.crMax) store.crMax = store.crMin
              }
            "
          />
          <input
            type="range"
            v-model.number="store.crMax"
            :min="0"
            :max="8"
            :step="0.25"
            class="cr-slider cr-slider-max"
            @input="
              () => {
                if (store.crMax < store.crMin) store.crMin = store.crMax
              }
            "
          />
          <div class="slider-track">
            <div
              class="slider-fill"
              :style="{
                left: `${(store.crMin / 8) * 100}%`,
                width: `${((store.crMax - store.crMin) / 8) * 100}%`,
              }"
            />
          </div>
          <div class="slider-labels">
            <span>0</span>
            <span>8</span>
          </div>
        </div>
      </div>

      <!-- ╭─ Movement chips ──────────────╮ -->
      <div class="sb-group">
        <div class="sb-label">
          <Navigation class="label-icon" />
          Movement Types
        </div>
        <div class="chips-grid">
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
      </div>

      <!-- ╭─ Senses (fold/udfold) ────────╮ -->
      <details class="sb-group sense-group" :open="sensesOpen">
        <summary class="sb-label expandable" @click.prevent="sensesOpen = !sensesOpen">
          <div class="label-content">
            <Eye class="label-icon" />
            Senses
          </div>
          <ChevronDown class="expand-icon" :class="{ rotated: sensesOpen }" />
        </summary>
        <div class="sense-wrap">
          <button
            v-for="s in senseTypes"
            :key="s"
            class="pill"
            :class="{ active: store.senses.includes(s) }"
            type="button"
            @click="store.toggleSense(s)"
          >
            <span class="pill-dot" />
            {{ formatSenseName(s) }}
          </button>
        </div>
      </details>

      <!-- ╭─ Footer ──────────────────────╮ -->
      <button class="reset-btn" @click="clearAllFilters">
        <RotateCcw class="ico-sm" />
        Nulstil alle filtre
      </button>
    </template>
  </aside>
</template>

<script setup>
import { useFilters } from '@/stores/useFilters'
import {
  ChevronDown,
  ChevronLeft,
  Droplet,
  Eye,
  Filter,
  Footprints,
  Navigation,
  RotateCcw,
  Search,
  Wind,
  X,
  Zap,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

/* store + lokal UI‑state */
const store = useFilters()
const panelOpen = ref(false)
const sensesOpen = ref(false)
const sidebarExpanded = ref(true)

/* chips‑data */
const movementTypes = [
  { key: 'fly', label: 'Fly', icon: Wind },
  { key: 'swim', label: 'Swim', icon: Droplet },
  { key: 'burrow', label: 'Burrow', icon: Footprints },
  { key: 'climb', label: 'Climb', icon: Footprints },
]

const senseTypes = ['blindsight', 'darkvision', 'tremorsense']

/* computed */
const activeFiltersCount = computed(() => {
  let count = 0
  if (store.q) count++
  if (store.crMin > 0 || store.crMax < 6) count++
  count += store.moves.length
  count += store.senses.length
  return count
})

/* methods */
const formatSenseName = (sense) => {
  return sense.charAt(0).toUpperCase() + sense.slice(1)
}

const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}

const clearAllFilters = () => {
  store.reset()
}
</script>

<style scoped>
/********** 1. SIDEBAR LAYOUT **********/
.sidebar {
  --w: 300px;
  --w-collapsed: 60px;
  width: var(--w);
  flex-shrink: 0;
  padding: 0;
  background: #0a0a0a;
  border-right: 1px solid #262626;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: var(--w-collapsed);
}

@media (min-width: 1024px) {
  .sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
  }
}

@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 40;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.4);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  /* På mobil, ignorer collapsed state */
  .sidebar.collapsed {
    width: var(--w);
  }
}

/********** 2. HEADER **********/
.sb-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #262626;
  background: #0f0f0f;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #dc2626;
}

.sb-head h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.icon-btn {
  background: none;
  border: 0;
  padding: 0.5rem;
  cursor: pointer;
  color: #737373;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #262626;
  color: #ffffff;
}

/********** 3. ACTIVE FILTERS **********/
.active-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #dc26261a;
  border-bottom: 1px solid #dc262633;
}

.active-count {
  font-size: 0.8125rem;
  color: #dc2626;
  font-weight: 500;
}

.clear-link {
  font-size: 0.8125rem;
  color: #dc2626;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.clear-link:hover {
  opacity: 0.8;
}

/********** 4. GROUPS & LABELS **********/
.sb-group {
  padding: 1.5rem;
  border-bottom: 1px solid #1a1a1a;
}

.sb-group:last-of-type {
  border-bottom: none;
}

.sb-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.sb-label.expandable {
  margin-bottom: 0;
  cursor: pointer;
  user-select: none;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.label-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  width: 1rem;
  height: 1rem;
  color: #737373;
}

.expand-icon {
  width: 1rem;
  height: 1rem;
  color: #737373;
  transition: transform 0.2s;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/********** 5. SEARCH INPUT **********/
.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.25rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #dc2626;
  background: #262626;
}

.search-input::placeholder {
  color: #525252;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #525252;
}

.clear-search {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.375rem;
  cursor: pointer;
  color: #525252;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #262626;
  color: #ffffff;
}

/********** 6. CR SLIDER **********/
.cr-range {
  margin-left: auto;
  background: #dc2626;
  color: #ffffff;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.range-slider-container {
  position: relative;
  padding: 1rem 0 1.5rem;
  height: 3rem;
}

.cr-slider {
  width: 100%;
  height: 0.375rem;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  z-index: 2;
  pointer-events: none;
}

.cr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  background: #ffffff;
  border: 3px solid #dc2626;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  pointer-events: all;
  position: relative;
  z-index: 5;
}

.cr-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.cr-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(0.95);
}

/* Firefox */
.cr-slider::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  background: #ffffff;
  border: 3px solid #dc2626;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  pointer-events: all;
  position: relative;
  z-index: 5;
}

.cr-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.cr-slider::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.cr-slider-min {
  z-index: 3;
}

.cr-slider-max {
  z-index: 2;
}

.slider-track {
  position: absolute;
  top: 1.1875rem;
  left: 0;
  right: 0;
  height: 0.375rem;
  background: #262626;
  border-radius: 0.1875rem;
  overflow: hidden;
  z-index: 1;
}

.slider-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
  border-radius: 0.1875rem;
  transition: all 0.2s;
}

.slider-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #737373;
  padding: 0 0.625rem;
}

/********** 7. CHIPS & PILLS **********/
.chips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #a3a3a3;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
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

.chip.active::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, #dc262615 100%);
}

.chip-ico {
  width: 1rem;
  height: 1rem;
  z-index: 1;
}

/********** 8. SENSES **********/
.sense-group {
  overflow: visible;
}

.sense-group summary {
  list-style: none;
}

.sense-group summary::-webkit-details-marker {
  display: none;
}

.sense-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 2rem;
  color: #a3a3a3;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
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

.pill-dot {
  width: 0.375rem;
  height: 0.375rem;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.5;
}

.pill.active .pill-dot {
  opacity: 1;
}

/********** 10. FOOTER **********/
.reset-btn {
  margin: auto 1.5rem 1.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #737373;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.reset-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
  background: #dc26260d;
}

/********** 11. FAB **********/
.fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  background: #dc2626;
  color: #ffffff;
  border: 0;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.35);
  z-index: 30;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(220, 38, 38, 0.45);
}

.fab:active {
  transform: scale(0.95);
}

.fab-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: #0a0a0a;
  color: #dc2626;
  border: 2px solid #dc2626;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

/********** 12. UTILITIES **********/
.ico {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.ico-sm {
  width: 1rem;
  height: 1rem;
}

/* Collapsed state styles */
.collapsed-content {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.collapsed-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #737373;
  cursor: pointer;
  transition: all 0.2s;
}

.collapsed-btn:hover {
  background: #262626;
  border-color: #404040;
  color: #ffffff;
}

.collapsed-btn.active {
  background: #dc26261a;
  border-color: #dc2626;
  color: #dc2626;
}

.collapsed-btn.reset {
  border-color: #737373;
}

.collapsed-btn.reset:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.collapsed-divider {
  width: 60%;
  height: 1px;
  background: #262626;
  margin: 0.5rem 0;
}

/* Hide expanded content when collapsed */
.sidebar.collapsed .sb-group,
.sidebar.collapsed .active-filters,
.sidebar.collapsed .reset-btn {
  display: none;
}

/* Header adjustments for collapsed state */
.sidebar.collapsed .header-title h2 {
  display: none;
}

.sidebar.collapsed .sb-head {
  justify-content: center;
  padding: 1rem 0.5rem;
}

/* Rotate chevron icon */
.rotate-180 {
  transform: rotate(180deg);
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 0.375rem;
}

.sidebar::-webkit-scrollbar-track {
  background: #0a0a0a;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #262626;
  border-radius: 0.1875rem;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #404040;
}

/* Responsive helpers */
@media (max-width: 1023px) {
  .lg\:hidden {
    display: none;
  }
}

@media (min-width: 1024px) {
  .lg\:block {
    display: block;
  }
}
</style>
