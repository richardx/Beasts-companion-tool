<script setup>
/* ---------- data & komponenter ---------- */
import beastsData from '@/assets/beasts.json'
import BeastCard from '@/components/BeastCard.vue'
import FilterSidebar from '@/components/FilterSidebar.vue'
/* ---------- Pinia ---------- */
import { useActiveBeasts } from '@/stores/activeBeasts'
import { useFilters } from '@/stores/useFilters'
import { computed, ref } from 'vue'

const active = useActiveBeasts()
const filters = useFilters()

/* ---------- view options ---------- */
const sortBy = ref('name') // 'name' | 'cr' | 'type'

/* ---------- filtreret og sorteret liste ---------- */
const beasts = computed(() => {
  let filtered = beastsData.filter(filters.predicate)

  // Sortering
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'cr':
        return (a.crNumeric || 0) - (b.crNumeric || 0)
      case 'type':
        return (a.type || '').localeCompare(b.type || '')
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return filtered
})

/* ---------- empty state check ---------- */
const hasFilters = computed(() => {
  return filters.q || filters.crMax < 6 || filters.moves.length > 0 || filters.senses.length > 0
})

/* ---------- methods ---------- */
const clearAllFilters = () => {
  filters.reset()
  filters.q = ''
}
</script>

<template>
  <!-- ─── LAYOUT WRAPPER ─────────────────────────────── -->
  <div class="page">
    <!-- ===== SIDEBAR (desktop) / FAB‑knap (mobil) ===== -->
    <FilterSidebar />

    <main class="content grow">
      <!-- ░░░ AKTIVE BEASTS (STICKY) ░░░ -->
      <section v-if="active.list.length" class="active-section">
        <div class="active-header">
          <h2 class="active-title">
            <span class="active-icon">⚔️</span>
            Active Beasts ({{ active.list.length }}/3)
          </h2>
        </div>
        <div class="active-grid">
          <BeastCard
            v-for="b in active.list"
            :key="'active-' + b.name"
            :beast="b"
            lock-expanded
            class="active-card"
          />
        </div>
      </section>

      <!-- ░░░ MAIN CONTENT AREA ░░░ -->
      <div class="main-content">
        <!-- ░░░ TOOLBAR ░░░ -->
        <div class="toolbar">
          <div class="results-info">
            <h3 class="results-count">
              {{ beasts.length }} {{ beasts.length === 1 ? 'Beast' : 'Beasts' }}
            </h3>
            <div v-if="hasFilters" class="active-filters-summary">
              <span class="filter-tag" v-if="filters.q"> "{{ filters.q }}" </span>
              <span class="filter-tag" v-if="filters.crMax < 6"> CR ≤ {{ filters.crMax }} </span>
              <span class="filter-tag" v-for="move in filters.moves" :key="move">
                {{ move }}
              </span>
            </div>
          </div>

          <div class="view-controls">
            <!-- Sort dropdown -->
            <select v-model="sortBy" class="sort-select">
              <option value="name">Sort by Name</option>
              <option value="cr">Sort by CR</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>

        <!-- ░░░ BEASTS GRID ░░░ -->
        <transition name="fade" mode="out-in">
          <div v-if="beasts.length > 0" class="beast-grid">
            <transition-group name="beast-fade">
              <BeastCard v-for="b in beasts" :key="b.name" :beast="b" />
            </transition-group>
          </div>

          <!-- ░░░ EMPTY STATE ░░░ -->
          <div v-else class="empty-state">
            <div class="empty-icon">🐾</div>
            <h3>No beasts found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button v-if="hasFilters" @click="clearAllFilters" class="reset-filters-btn">
              Clear all filters
            </button>
          </div>
        </transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
/*****  GLOBAL STYLES  *****/
.page {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/*****  ACTIVE BEASTS SECTION  *****/
.active-section {
  background: linear-gradient(180deg, #1a0a0a 0%, #0f0505 100%);
  border-bottom: 1px solid #dc2626;
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(10px);
}

.active-header {
  padding: 1.5rem 2rem 1rem;
}

.active-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: #dc2626;
  font-weight: 700;
  font-size: 1.25rem;
}

.active-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.5));
}

.active-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  padding: 0 2rem 1.5rem;
}

/*****  MAIN CONTENT  *****/
.main-content {
  flex: 1;
  padding: 2rem;
}

/*****  TOOLBAR  *****/
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #262626;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.results-count {
  font-size: 1.125rem;
  color: #a3a3a3;
  font-weight: 500;
  margin: 0;
}

.active-filters-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  padding: 0.25rem 0.75rem;
  background: #262626;
  border: 1px solid #404040;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #e5e5e5;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-select:hover {
  border-color: #404040;
}

.sort-select:focus {
  outline: none;
  border-color: #dc2626;
}

.view-toggle {
  display: flex;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #737373;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.view-btn:hover {
  color: #ffffff;
}

.view-btn.active {
  background: #262626;
  color: #dc2626;
}

.view-btn .icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}

/*****  BEAST GRIDS  *****/
.beast-container {
  position: relative;
}

.beast-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
}

.beast-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* List view modifications */
.beast-list :deep(.beast-card) {
  max-width: 100%;
  padding: 1rem 1.25rem;
}

.beast-list :deep(.detail-body) {
  display: none !important;
}

.beast-list :deep(.token-thumb) {
  width: 48px;
  height: 48px;
}

/*****  EMPTY STATE  *****/
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #737373;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
  filter: grayscale(1);
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #a3a3a3;
}

.empty-state p {
  font-size: 1rem;
  color: #525252;
  margin-bottom: 1.5rem;
}

.reset-filters-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-filters-btn:hover {
  background: #dc2626;
  color: #ffffff;
}

/*****  ANIMATIONS  *****/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.beast-fade-enter-active,
.beast-fade-leave-active {
  transition: all 0.3s ease;
}

.beast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.beast-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.beast-fade-move {
  transition: transform 0.3s ease;
}

/*****  RESPONSIVE  *****/
@media (max-width: 1024px) {
  .main-content {
    padding: 1.5rem;
  }

  .active-header {
    padding: 1.25rem 1.5rem 0.75rem;
  }

  .active-grid {
    padding: 0 1.5rem 1.25rem;
    grid-template-columns: 1fr;
  }

  .beast-grid {
    grid-template-columns: 1fr;
  }
}

/*****  DARK THEME ENHANCEMENTS  *****/
:deep(.beast-card) {
  background: #1a1a1a;
  border: 1px solid #262626;
  color: #ffffff;
}

:deep(.beast-card:hover) {
  border-color: #404040;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* Active cards special styling */
.active-card :deep(.beast-card) {
  background: linear-gradient(135deg, #1a1a1a 0%, #261a1a 100%);
  border-color: #dc262633;
}

/* Loading skeleton */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-skeleton {
  background: linear-gradient(90deg, #1a1a1a 0%, #262626 50%, #1a1a1a 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 0.75rem;
  height: 200px;
}
</style>
