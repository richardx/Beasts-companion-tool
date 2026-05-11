<template>
  <div class="spell-card" :class="{ expanded }">
    <div class="level-badge" :class="levelClass">{{ levelLabel }}</div>

    <div class="card-header" @click="expanded = !expanded">
      <div class="header-left">
        <h3 class="spell-name">{{ spell.name }}</h3>
        <div class="spell-sub">
          <span class="spell-school">{{ spell.school }}</span>
          <span v-if="spell.concentration" class="tag conc-tag" title="Concentration">C</span>
          <span v-if="spell.ritual" class="tag ritual-tag" title="Ritual">R</span>
          <span v-for="cat in spell.categories" :key="cat" class="cat-chip" :class="`cat-${cat}`">
            {{ catLabel(cat) }}
          </span>
        </div>
      </div>
      <div class="card-actions">
        <button
          class="star-btn"
          :class="{ active: isPinned }"
          @click.stop="activeSpells.toggle(spell)"
          :title="isPinned ? 'Fjern aktiv spell' : 'Sæt som aktiv spell'"
        >
          <Star class="star-ico" />
        </button>
        <ChevronDown class="expand-icon" :class="{ rotated: expanded }" />
      </div>
    </div>

    <div v-if="expanded" class="spell-body">
      <div class="spell-meta">
        <div class="meta-item">
          <span class="meta-label">Casting Time</span>
          <span class="meta-value">{{ spell.castingTime }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Range</span>
          <span class="meta-value">{{ spell.range }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Components</span>
          <span class="meta-value">{{ componentsStr }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Duration</span>
          <span class="meta-value">{{ spell.duration }}</span>
        </div>
      </div>
      <p v-if="spell.components.material && spell.components.materialDesc" class="material-note">
        <em>Materials: {{ spell.components.materialDesc }}</em>
      </p>
      <div class="spell-desc" v-html="formattedDesc" />
      <div v-if="spell.atHigherLevels" class="higher-levels">
        <span class="hl-label">At Higher Levels.</span> {{ spell.atHigherLevels }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDown, Star } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useActiveSpells } from '@/stores/useActiveSpells'

const props = defineProps({
  spell: { type: Object, required: true },
  forceExpanded: { type: Boolean, default: false },
})

const activeSpells = useActiveSpells()
const isPinned = computed(() => activeSpells.isPinned(props.spell.name))

const expanded = ref(props.forceExpanded)
watch(() => props.forceExpanded, (val) => { expanded.value = val })

const onToggleAll = (e) => {
  if (!props.forceExpanded) expanded.value = e.detail.expanded
}
onMounted(() => window.addEventListener('toggle-all-spells', onToggleAll))
onBeforeUnmount(() => window.removeEventListener('toggle-all-spells', onToggleAll))

const levelLabel = computed(() => (props.spell.level === 0 ? 'Cantrip' : `L${props.spell.level}`))

const levelClass = computed(() => {
  const l = props.spell.level
  if (l === 0) return 'level-cantrip'
  if (l <= 2) return 'level-low'
  if (l <= 4) return 'level-mid'
  return 'level-high'
})

const componentsStr = computed(() => {
  const c = props.spell.components
  const parts = []
  if (c.verbal) parts.push('V')
  if (c.somatic) parts.push('S')
  if (c.material) parts.push('M')
  return parts.join(', ')
})

const formattedDesc = computed(() =>
  props.spell.description.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>'),
)

const catLabel = (cat) =>
  ({ damage: 'Damage', support: 'Support', control: 'Control', utility: 'Utility' })[cat] ?? cat
</script>

<style scoped>
.spell-card {
  position: relative;
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.level-badge {
  position: absolute;
  top: -1px;
  right: -1px;
  padding: 0.3rem 0.65rem;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 0 0.75rem 0 0.75rem;
  border: 1px solid;
  letter-spacing: 0.04em;
}

.level-cantrip {
  background: #1c1917;
  border-color: #57534e;
  color: #a8a29e;
}

.level-low {
  background: #166534;
  border-color: #16a34a;
  color: #bbf7d0;
}

.level-mid {
  background: #78350f;
  border-color: #f59e0b;
  color: #fde68a;
}

.level-high {
  background: #991b1b;
  border-color: #dc2626;
  color: #fecaca;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 5.5rem 0.875rem 1.125rem;
  cursor: pointer;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.spell-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spell-sub {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.spell-school {
  font-size: 0.75rem;
  color: #737373;
}

.tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  letter-spacing: 0.05em;
}

.conc-tag {
  background: #1e3a5f;
  color: #93c5fd;
  border: 1px solid #3b82f6;
}

.ritual-tag {
  background: #2d1b69;
  color: #c4b5fd;
  border: 1px solid #7c3aed;
}

.cat-chip {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 1rem;
  letter-spacing: 0.04em;
}

.cat-damage {
  background: #7f1d1d;
  color: #fca5a5;
  border: 1px solid #dc2626;
}

.cat-support {
  background: #14532d;
  color: #86efac;
  border: 1px solid #16a34a;
}

.cat-control {
  background: #312e81;
  color: #a5b4fc;
  border: 1px solid #6366f1;
}

.cat-utility {
  background: #1c1917;
  color: #a8a29e;
  border: 1px solid #57534e;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.star-btn {
  background: none;
  border: none;
  padding: 0.35rem;
  cursor: pointer;
  color: #525252;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.star-btn:hover {
  color: #f59e0b;
}

.star-btn.active {
  color: #f59e0b;
}

.star-btn.active .star-ico {
  fill: #f59e0b;
}

.star-ico {
  width: 1rem;
  height: 1rem;
}

.expand-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #525252;
  transition: transform 0.2s, color 0.2s;
  flex-shrink: 0;
}

.expand-icon.rotated {
  transform: rotate(180deg);
  color: #f59e0b;
}

.spell-card:hover .expand-icon {
  color: #a3a3a3;
}

.spell-body {
  padding: 0 1.125rem 1.125rem;
  border-top: 1px solid #262626;
}

.spell-meta {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: #141414;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  margin-top: 0.875rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  padding: 0.625rem 0.75rem;
  border-right: 1px solid #1f1f1f;
}

.meta-item:last-child {
  border-right: none;
}

.meta-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #525252;
  margin-bottom: 0.25rem;
}

.meta-value {
  font-size: 0.8rem;
  color: #e5e5e5;
  line-height: 1.4;
}

.material-note {
  font-size: 0.75rem;
  color: #737373;
  margin: -0.5rem 0 0.75rem;
}

.spell-desc {
  font-size: 0.875rem;
  line-height: 1.65;
  color: #d4d4d4;
  margin: 0 0 0.75rem;
}

.higher-levels {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #a3a3a3;
  border-left: 2px solid #f59e0b;
  padding-left: 0.75rem;
  margin-top: 0.75rem;
}

.hl-label {
  font-weight: 700;
  color: #f59e0b;
}

@media (max-width: 600px) {
  .spell-meta {
    grid-template-columns: repeat(2, 1fr);
  }

  .meta-item:nth-child(2) {
    border-right: none;
  }

  .meta-item:nth-child(odd):not(:last-child) {
    border-bottom: 1px solid #1f1f1f;
  }
}
</style>
