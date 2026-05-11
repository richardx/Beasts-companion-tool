<script setup>
/* ---------- data & komponenter ---------- */
import beastsData from '@/assets/beasts.json'
import polymorphData from '@/assets/polymorph.json'
import spellsData from '@/assets/spells.json'
import BeastCard from '@/components/BeastCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import NotesPanel from '@/components/NotesPanel.vue'
import SpellCard from '@/components/SpellCard.vue'
import SpellFilterBar from '@/components/SpellFilterBar.vue'
/* ---------- Pinia ---------- */
import { useActiveBeasts } from '@/stores/activeBeasts'
import { useActiveSpells } from '@/stores/useActiveSpells'
import { useFilters } from '@/stores/useFilters'
import { useSpellFilters } from '@/stores/useSpellFilters'
import { computed, ref } from 'vue'

const active = useActiveBeasts()
const activeSpells = useActiveSpells()
const filters = useFilters()
const spellFilters = useSpellFilters()

/* ---------- fane + view options ---------- */
const activeTab = ref('wildshape') // 'wildshape' | 'polymorph' | 'spells'
const sortBy = ref('name')
const sortDirection = ref('asc') // 'asc' | 'desc'
const viewMode = ref('grid') // 'grid' | 'compact'
const showAllExpanded = ref(false)

/* ---------- helper function til at parse CR til numerisk værdi ---------- */
const parseCR = (cr) => {
  if (!cr) return 0
  if (cr === '1/8') return 0.125
  if (cr === '1/4') return 0.25
  if (cr === '1/2') return 0.5
  return parseFloat(cr) || 0
}

/* ---------- helper function til at få max speed ---------- */
const getMaxSpeed = (beast) => {
  let maxSpeed = 0
  if (beast.speed) {
    // Parse forskellige speed typer (walk, fly, swim, climb, burrow)
    const speedMatch = beast.speed.match(/(\d+)\s*ft/g)
    if (speedMatch) {
      speedMatch.forEach((match) => {
        const speed = parseInt(match)
        if (speed > maxSpeed) maxSpeed = speed
      })
    }
  }
  return maxSpeed
}

/* ---------- helper function til at få primary movement type ---------- */
const getPrimaryMovementType = (beast) => {
  if (!beast.speed) return 'walk'
  const speed = beast.speed.toLowerCase()
  if (speed.includes('fly')) return 'fly'
  if (speed.includes('swim')) return 'swim'
  if (speed.includes('burrow')) return 'burrow'
  if (speed.includes('climb')) return 'climb'
  return 'walk'
}

/* ---------- helper function til size order ---------- */
const sizeOrder = {
  Tiny: 1,
  Small: 2,
  Medium: 3,
  Large: 4,
  Huge: 5,
  Gargantuan: 6,
}

/* ---------- filtreret og sorteret liste ---------- */
const beasts = computed(() => {
  if (activeTab.value === 'polymorph') return polymorphData

  let filtered = beastsData.filter(filters.predicate)

  // Sortering
  filtered.sort((a, b) => {
    let compareValue = 0

    switch (sortBy.value) {
      case 'cr':
        compareValue = (parseCR(a.cr) || 0) - (parseCR(b.cr) || 0)
        break
      case 'type':
        compareValue = (a.type || '').localeCompare(b.type || '')
        break
      case 'hp':
        compareValue = (a.hp || 0) - (b.hp || 0)
        break
      case 'ac':
        compareValue = (a.ac || 0) - (b.ac || 0)
        break
      case 'speed':
        compareValue = getMaxSpeed(a) - getMaxSpeed(b)
        break
      case 'size':
        compareValue = (sizeOrder[a.size] || 3) - (sizeOrder[b.size] || 3)
        break
      case 'movement':
        compareValue = getPrimaryMovementType(a).localeCompare(getPrimaryMovementType(b))
        break
      case 'str':
        compareValue = (a.str || 0) - (b.str || 0)
        break
      case 'con':
        compareValue = (a.con || 0) - (b.con || 0)
        break
      default: // 'name'
        compareValue = a.name.localeCompare(b.name)
    }

    // Anvend sorterings retning
    return sortDirection.value === 'desc' ? -compareValue : compareValue
  })

  return filtered
})

/* ---------- spells grouped by level ---------- */
const spellsByLevel = computed(() => {
  const filtered = spellsData.filter(spellFilters.predicate)
  const groups = {}
  for (const spell of filtered) {
    if (!groups[spell.level]) groups[spell.level] = []
    groups[spell.level].push(spell)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([level, spells]) => ({
      level: Number(level),
      label: Number(level) === 0 ? 'Cantrips' : `Level ${level}`,
      spells: spells.sort((a, b) => a.name.localeCompare(b.name)),
    }))
})

/* ---------- empty state check ---------- */
const hasFilters = computed(() => {
  if (activeTab.value !== 'wildshape') return false
  return filters.q || filters.crMax < 6 || filters.moves.length > 0 || filters.senses.length > 0
})

/* ---------- methods ---------- */
const clearAllFilters = () => {
  filters.reset()
  filters.q = ''
}

const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const toggleAllExpanded = () => {
  showAllExpanded.value = !showAllExpanded.value
  window.dispatchEvent(new CustomEvent('toggle-all-beasts', { detail: { expanded: showAllExpanded.value } }))
}

const showAllSpellsExpanded = ref(false)
const toggleAllSpellsExpanded = () => {
  showAllSpellsExpanded.value = !showAllSpellsExpanded.value
  window.dispatchEvent(new CustomEvent('toggle-all-spells', { detail: { expanded: showAllSpellsExpanded.value } }))
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'compact' : 'grid'
}
</script>

<template>
  <!-- ─── LAYOUT WRAPPER ─────────────────────────────── -->
  <div class="page">
    <main class="content">
      <!-- ░░░ STICKY TOP: FANER ░░░ -->
      <div class="sticky-top">
        <div class="tab-bar">
          <button
            class="tab"
            :class="{ active: activeTab === 'wildshape' }"
            @click="activeTab = 'wildshape'"
          >
            🐺 Wildshape
          </button>
          <button
            class="tab"
            :class="{ active: activeTab === 'polymorph' }"
            @click="activeTab = 'polymorph'"
          >
            ✨ Polymorph
          </button>
          <button
            class="tab tab-spells"
            :class="{ active: activeTab === 'spells' }"
            @click="activeTab = 'spells'"
          >
            🔮 Spells
          </button>
        </div>
      </div>

      <!-- Aktive beasts: wildshape + polymorph (scrollable, skjult på spells-fanen) -->
      <section v-if="(active.wildshape || active.polymorph) && activeTab !== 'spells'" class="active-section">
        <div class="active-slots">
          <!-- Wildshape slot -->
          <div class="active-slot ws-slot">
            <div class="slot-label ws-label">⚔️ Wildshape</div>
            <BeastCard
              v-if="active.wildshape"
              :key="active.wildshape.name"
              :beast="active.wildshape"
              lock-expanded
              beast-type="wildshape"
              class="ws-card"
            />
            <div v-else class="slot-empty">Ingen wildshape valgt</div>
          </div>

          <!-- Polymorph slot -->
          <div class="active-slot poly-slot">
            <div class="slot-label poly-label">
              ✨ Polymorph
              <span v-if="active.polymorph?.hp" class="slot-hp">{{ active.polymorph.hp.split(' ')[0] }} HP</span>
            </div>
            <BeastCard
              v-if="active.polymorph"
              :key="active.polymorph.name"
              :beast="active.polymorph"
              lock-expanded
              beast-type="polymorph"
              show-all-stats
              class="poly-card"
            />
            <div v-else class="slot-empty">Ingen polymorph valgt</div>
          </div>
        </div>
      </section>

      <!-- Filterbar (kun wildshape) -->
      <FilterBar v-if="activeTab === 'wildshape'" />

      <!-- ░░░ SPELLS FANE ░░░ -->
      <template v-if="activeTab === 'spells'">
        <!-- Aktive spells øverst -->
        <section v-if="activeSpells.pinned.length" class="active-spells-section">
          <div class="active-spells-label">⭐ Active Spells</div>
          <div class="active-spells-grid">
            <SpellCard
              v-for="s in activeSpells.pinned"
              :key="s.name"
              :spell="s"
              :force-expanded="true"
            />
          </div>
        </section>

        <SpellFilterBar />
        <div class="main-content">
          <div class="spells-toolbar">
            <button class="action-btn" @click="toggleAllSpellsExpanded">
              {{ showAllSpellsExpanded ? 'Collapse All' : 'Expand All' }}
            </button>
          </div>
          <template v-if="spellsByLevel.length > 0">
            <div v-for="group in spellsByLevel" :key="group.level" class="spell-level-group">
              <h3 class="level-heading">{{ group.label }}</h3>
              <div class="spell-grid">
                <SpellCard v-for="s in group.spells" :key="s.name" :spell="s" />
              </div>
            </div>
          </template>
          <div v-else class="empty-state">
            <div class="empty-icon">🔮</div>
            <h3>No spells found</h3>
            <p>Try adjusting your filters</p>
            <button @click="spellFilters.reset()" class="reset-filters-btn">Clear filters</button>
          </div>
        </div>
      </template>

      <!-- ░░░ MAIN CONTENT AREA (wildshape + polymorph) ░░░ -->
      <div v-if="activeTab !== 'spells'" class="main-content">
        <!-- ░░░ TOOLBAR (kun wildshape) ░░░ -->
        <div v-if="activeTab === 'wildshape'" class="toolbar">
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
            <!-- Quick actions -->
            <div class="quick-actions">
              <button
                @click="toggleAllExpanded"
                class="action-btn"
                :title="showAllExpanded ? 'Collapse all' : 'Expand all'"
              >
                <svg
                  v-if="!showAllExpanded"
                  class="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 18l6-6-6-6" />
                  <path d="M15 18l6-6-6-6" />
                </svg>
                <svg
                  v-else
                  class="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                  <path d="M9 18l-6-6 6-6" />
                </svg>
                <span class="action-label">{{
                  showAllExpanded ? 'Collapse All' : 'Expand All'
                }}</span>
              </button>

              <button
                @click="toggleViewMode"
                class="action-btn"
                :title="`Switch to ${viewMode === 'grid' ? 'compact' : 'grid'} view`"
              >
                <svg
                  v-if="viewMode === 'grid'"
                  class="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                <svg
                  v-else
                  class="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3" y2="6.01" />
                  <line x1="3" y1="12" x2="3" y2="12.01" />
                  <line x1="3" y1="18" x2="3" y2="18.01" />
                </svg>
                <span class="action-label"
                  >{{ viewMode === 'grid' ? 'Compact' : 'Grid' }} View</span
                >
              </button>
            </div>

            <!-- Sort dropdown with direction -->
            <div class="sort-container">
              <select v-model="sortBy" class="sort-select">
                <option value="name">Sort by Name</option>
                <option value="cr">Sort by CR</option>
                <option value="type">Sort by Type</option>
                <option value="hp">Sort by Hit Points</option>
                <option value="ac">Sort by Armor Class</option>
                <option value="speed">Sort by Speed</option>
                <option value="size">Sort by Size</option>
                <option value="movement">Sort by Movement Type</option>
                <option value="str">Sort by Strength</option>
                <option value="con">Sort by Constitution</option>
              </select>
              <button
                @click="toggleSortDirection"
                class="sort-direction-btn"
                :title="`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`"
              >
                <svg
                  v-if="sortDirection === 'asc'"
                  class="sort-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <svg
                  v-else
                  class="sort-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ░░░ BEASTS GRID ░░░ -->
        <transition name="fade" mode="out-in">
          <div
            v-if="beasts.length > 0"
            :class="[viewMode === 'compact' ? 'beast-list' : 'beast-grid', `tab-${activeTab}`]"
          >
            <transition-group name="beast-fade">
              <BeastCard
                v-for="b in beasts"
                :key="b.name"
                :beast="b"
                :force-expanded="showAllExpanded"
                :compact-mode="viewMode === 'compact'"
                :beast-type="activeTab"
                :show-all-stats="activeTab === 'polymorph'"
              />
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

    <!-- ░░░ NOTER-PANEL ░░░ -->
    <NotesPanel />
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
  min-width: 0;
}

/*****  STICKY TOP: AKTIVE BEASTS + FANER  *****/
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #0a0a0a;
}

.active-section {
  border-bottom: 1px solid #1a1a1a;
  background: #0a0a0a;
}

.active-slots {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  align-items: stretch;
}

.active-slot {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.slot-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 0.5rem 0.5rem 0 0;
  flex-shrink: 0;
}

.ws-label {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #dc2626;
}

.poly-label {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid #8b5cf6;
  justify-content: space-between;
}

.slot-hp {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 0.75rem;
  padding: 0.1rem 0.5rem;
  letter-spacing: 0.02em;
}

.active-slot > .ws-card,
.active-slot > .poly-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.active-slot > .slot-empty {
  padding: 0.75rem 1rem;
}

/* Wildshape ring */
.ws-card :deep(.beast-card) {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px #dc2626, 0 0 24px rgba(220, 38, 38, 0.2);
  background: linear-gradient(135deg, #1a0a0a 0%, #1a1a1a 100%);
  height: 100%;
}

/* Polymorph ring */
.poly-card :deep(.beast-card) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px #8b5cf6, 0 0 24px rgba(139, 92, 246, 0.2);
  background: linear-gradient(135deg, #0d0a1a 0%, #1a1a1a 100%);
  height: 100%;
}

/* Disable hover lift on active cards */
.ws-card :deep(.beast-card:hover) {
  transform: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 2px #dc2626, 0 0 24px rgba(220, 38, 38, 0.2);
}

.ws-card :deep(.beast-card:hover::before),
.poly-card :deep(.beast-card:hover::before) {
  opacity: 0;
}

.poly-card :deep(.beast-card:hover) {
  transform: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px #8b5cf6, 0 0 24px rgba(139, 92, 246, 0.2);
}

.slot-empty {
  color: #404040;
  font-size: 0.8125rem;
  font-style: italic;
  padding: 0.5rem 0;
}

/*****  FANER  *****/
.tab-bar {
  display: flex;
  border-bottom: 1px solid #262626;
  background: #0f0f0f;
}

.tab {
  padding: 0.875rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #737373;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tab:hover {
  color: #ffffff;
}

.tab.active {
  color: #ffffff;
  border-bottom-color: #dc2626;
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
  flex-wrap: wrap;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn:hover {
  border-color: #dc2626;
  background: #262626;
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.action-label {
  display: none;
}

@media (min-width: 640px) {
  .action-label {
    display: inline;
  }
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.sort-direction-btn {
  padding: 0.5rem;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.5rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-direction-btn:hover {
  border-color: #404040;
  background: #262626;
}

.sort-icon {
  width: 1.25rem;
  height: 1.25rem;
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

/* Tab-specific hover glow */
.tab-wildshape :deep(.beast-card:hover) {
  border-color: #dc262666;
  box-shadow: 0 4px 24px rgba(220, 38, 38, 0.15);
}

.tab-polymorph :deep(.beast-card:hover) {
  border-color: #8b5cf666;
  box-shadow: 0 4px 24px rgba(139, 92, 246, 0.15);
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

/*****  SPELLS  *****/
.active-spells-section {
  padding: 1rem 2rem;
  background: #0d0d0d;
  border-bottom: 1px solid #1a1a1a;
}

.active-spells-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f59e0b;
  margin-bottom: 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #f59e0b33;
}

.active-spells-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
}

.spells-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}


.spell-level-group {
  margin-bottom: 2rem;
}

.level-heading {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f59e0b;
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f59e0b33;
}

.spell-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
}

.tab-spells.active {
  border-bottom-color: #f59e0b;
  color: #fde68a;
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
