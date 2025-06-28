<template>
  <article class="beast-card" :class="{ collapsed: !expanded }" ref="cardRef">
    <!-- ───────── TITLE ROW (THUMB + NAME + ACTIONS) ───────── -->
    <header
      class="title-row"
      @click="handleToggle"
      :aria-label="lockExpanded ? 'Aktivt beast – kan ikke skjules' : 'Fold kortet ind/ud'"
    >
      <!-- CR Badge -->
      <div class="cr-badge" :class="getCRClass(beast.cr)">CR {{ beast.cr }}</div>

      <!-- thumbnail kun synlig når kortet er collapsed -->
      <img
        v-if="!expanded"
        class="token-thumb"
        :class="{ 'compact-thumb': compactMode && !expanded }"
        :src="currentSrc"
        :alt="beast.name"
        @error.stop="onImgError"
      />

      <div class="title-col">
        <h2 class="name">
          <a :href="monsterUrl" target="_blank" rel="noopener">{{ beast.name }}</a>
        </h2>
        <!-- Movement icons inline with name -->
        <div class="title-badges">
          <svg
            v-if="hasSwim"
            class="icon tag swim-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Swim speed"
          >
            <path d="M2 17c4 0 4-2 8-2s4 2 8 2 4-2 8-2v2c-4 0-4 2-8 2s-4-2-8-2-4 2-8 2v-2Z" />
          </svg>
          <svg
            v-if="hasFly"
            class="icon tag fly-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Fly speed"
          >
            <path
              d="M12 3 2 9l10 4 10-4-10-6Zm0 6.75L4.5 9m15 0L12 9.75M2 15l10 4 10-4M12 15.75 4.5 15m15 0L12 15.75"
            />
          </svg>
          <svg
            v-if="beast.speed?.climbSpeed"
            class="icon tag climb-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Climb speed"
          >
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
            />
          </svg>
          <svg
            v-if="beast.speed?.burrowSpeed"
            class="icon tag burrow-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Burrow speed"
          >
            <circle cx="12" cy="12" r="3" />
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-dasharray="4 2"
            />
          </svg>
        </div>
        <p v-show="expanded" class="subline">{{ typeAlignment }}</p>
      </div>

      <!-- star + collapse buttons (separate click targets) -->
      <div class="title-actions" @click.stop>
        <button
          class="icon-btn star-btn"
          @click="toggleActive"
          :aria-label="isActive ? 'Fjern fra aktive' : 'Tilføj som aktiv'"
        >
          <svg
            v-if="isActive"
            class="icon star-filled"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.5 15 9l7 .6-5.3 4.9 1.4 7-6.1-3.5L6 21.5l1.4-7L2 9.6 9 9l3-6.5Z" />
          </svg>
          <svg
            v-else
            class="icon star-outline"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="m12 2.5 3 6.5 7 .6-5.3 4.9 1.4 7-6.1-3.5L6 21.5l1.4-7L2 9.6l7-.6 3-6.5Zm0 3-1.6 3.5a1 1 0 0 1-.8.6l-3.8.3 2.9 2.7a1 1 0 0 1 .3.9l-.7 3.9L12 15l3.3 1.8-.7-3.9a1 1 0 0 1 .3-.9l2.9-2.7-3.8-.3a1 1 0 0 1-.8-.6L12 5.5Z"
            />
          </svg>
        </button>
        <button
          class="icon-btn toggle-btn"
          @click="handleToggle"
          :disabled="lockExpanded"
          :aria-label="expanded ? 'Skjul detaljer' : 'Vis detaljer'"
        >
          <svg
            v-if="expanded"
            class="icon chevron-up"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M18 14 12 8 6 14"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            class="icon chevron-down"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="m6 10 6 6 6-6"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- ───────── COLLAPSIBLE BODY ───────── -->
    <div v-show="expanded" class="detail-body">
      <!--=========== CORE STATS + THUMB SIDE BY SIDE ===========-->
      <div class="core-thumb-row">
        <section class="core">
          <dl>
            <div>
              <dt>Init</dt>
              <dd class="stat-value">{{ signed(initMod) }}</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd class="speed-list">
                <div v-for="(v, k) in beast.speed" :key="k">{{ labelSpeed(k) }} {{ v }}</div>
              </dd>
            </div>
            <div v-if="sensesText">
              <dt>Senses</dt>
              <dd class="senses-list">
                <span v-for="(value, sense) in beast.senses" :key="sense" class="sense-item">
                  <template v-if="sense === 'passivePerception'">
                    Passive
                    <a
                      :href="getSkillLink('perception')"
                      target="_blank"
                      class="skill-link"
                      title="View Perception rules"
                    >
                      Perception
                    </a>
                    {{ value }}
                  </template>
                  <template v-else>
                    <a
                      v-if="getSenseLink(sense)"
                      :href="getSenseLink(sense)"
                      target="_blank"
                      class="sense-link"
                      :title="`View ${cap(sense)} rules`"
                    >
                      {{ cap(sense) }}
                    </a>
                    <span v-else>{{ cap(sense) }}</span>
                    {{ value }}
                  </template>
                  <span v-if="!isLastItem(sense, beast.senses)">; </span>
                </span>
              </dd>
            </div>
            <div>
              <dt>CR</dt>
              <dd>{{ beast.cr }}</dd>
            </div>
            <div v-if="conditionText">
              <dt>Conditions</dt>
              <dd class="condition-list">
                <span
                  v-for="condition in conditionText.split(', ')"
                  :key="condition"
                  class="condition-tag"
                >
                  <a
                    v-if="getConditionLink(condition)"
                    :href="getConditionLink(condition)"
                    target="_blank"
                    class="condition-link"
                    :title="`View ${condition} condition`"
                  >
                    {{ condition }}
                  </a>
                  <span v-else>{{ condition }}</span>
                </span>
              </dd>
            </div>
            <div v-if="resistText">
              <dt>Resist.</dt>
              <dd>{{ resistText }}</dd>
            </div>
            <div v-if="immuneText">
              <dt>Immune</dt>
              <dd>{{ immuneText }}</dd>
            </div>
          </dl>
        </section>

        <!-- thumbnail i detail view - vises når expanded -->
        <img
          class="token-thumb detail-thumb"
          :src="currentSrc"
          :alt="beast.name"
          @error.stop="onImgError"
        />
      </div>

      <!--=========== ABILITY TABLE ===========-->
      <section class="ability-table" v-if="beast.stats">
        <table>
          <thead>
            <tr>
              <th v-for="a in abilityOrder" :key="a">{{ a.toUpperCase() }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="a in abilityOrder" :key="a">
                <span class="score">{{ beast.stats[a] ?? '–' }}</span>
                <span class="mod" v-if="beast.stats[a] !== null"
                  >({{ abilityMod(beast.stats[a]) }})</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <p v-if="skillsText" class="skills">
        <strong>Skills</strong>
        <span v-for="(value, skill) in beast.skills" :key="skill" class="skill-item">
          <a
            v-if="getSkillLink(skill)"
            :href="getSkillLink(skill)"
            target="_blank"
            class="skill-link"
            :title="`View ${cap(skill)} rules`"
          >
            {{ cap(skill) }} +{{ value }}
          </a>
          <span v-else>{{ cap(skill) }} +{{ value }}</span>
          <span v-if="!isLastItem(skill, beast.skills)">, </span>
        </span>
      </p>

      <h3 v-if="beast.traits?.length" class="section-title">Traits</h3>
      <section v-if="beast.traits?.length" class="traits">
        <div v-for="t in beast.traits" :key="t.name + t.description" class="ability-item">
          <template v-if="t.name">
            <strong>{{ t.name }}</strong
            >.
          </template>
          <span v-html="formatSpellcasting(t.description)"></span>
        </div>
      </section>

      <h3 v-if="beast.actions?.length" class="section-title">Actions</h3>
      <section v-if="beast.actions?.length" class="actions">
        <div v-for="a in beast.actions" :key="a.name + a.description" class="ability-item">
          <strong>{{ a.name }}</strong
          >. {{ a.description }}
        </div>
      </section>

      <h3 v-if="beast.bonusActions?.length" class="section-title">Bonus Actions</h3>
      <section v-if="beast.bonusActions?.length" class="bonus-actions">
        <div v-for="b in beast.bonusActions" :key="b.name + b.description" class="ability-item">
          <strong>{{ b.name }}</strong
          >. {{ b.description }}
        </div>
      </section>

      <h3 v-if="beast.reactions?.length" class="section-title">Reactions</h3>
      <section v-if="beast.reactions?.length" class="reactions">
        <div v-for="r in beast.reactions" :key="r.name + r.description" class="ability-item">
          <strong>{{ r.name }}</strong
          >. {{ r.description }}
        </div>
      </section>
    </div>
  </article>
</template>

<script setup>
import { getConditionLink, getSenseLink, getSkillLink } from '@/utils/dndLinks'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useActiveBeasts } from '../stores/activeBeasts'

const props = defineProps({
  beast: { type: Object, required: true },
  lockExpanded: { type: Boolean, default: false },
  forceExpanded: { type: Boolean, default: false },
  compactMode: { type: Boolean, default: false },
})

// ── EXPANSION STATE ───────────────────────────────────────────
const activeStore = useActiveBeasts()
const isActive = computed(() => activeStore.contains(props.beast.name))
const expanded = ref(props.lockExpanded || props.forceExpanded)

// Watch for forceExpanded changes
watch(
  () => props.forceExpanded,
  (newVal) => {
    if (!props.lockExpanded) {
      expanded.value = newVal
    }
  },
)

// Listen for toggle-all-beasts event
const handleToggleAll = (event) => {
  if (!props.lockExpanded) {
    expanded.value = event.detail.expanded
  }
}

onMounted(() => {
  window.addEventListener('toggle-all-beasts', handleToggleAll)
})

onUnmounted(() => {
  window.removeEventListener('toggle-all-beasts', handleToggleAll)
})

watch(isActive, (val) => {
  if (props.lockExpanded && val) {
    expanded.value = true
    nextTick(() => cardRef.value?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  }
})

const handleToggle = () => {
  if (props.lockExpanded) return
  expanded.value = !expanded.value
}
const toggleActive = () => activeStore.toggle(props.beast)

// ── IMG HANDLING ──────────────────────────────────────────────
const exts = ['webp', 'png', 'jpg']
const idx = ref(0)
const getSrc = (ext) => `/beast_images/${encodeURIComponent(props.beast.name)}.${ext}`
const currentSrc = ref(getSrc(exts[idx.value]))
const onImgError = () => {
  idx.value += 1
  if (idx.value < exts.length) currentSrc.value = getSrc(exts[idx.value])
}

// ── HELPERS / COMPUTEDS ───────────────────────────────────────
const signed = (n) => (n >= 0 ? `+${n}` : n)
const abilityOrder = ['str', 'dex', 'con']
const abilityMod = (s) => (s ? Math.floor((s - 10) / 2) : 0)
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const labelSpeed = (k) => cap(k.replace('Speed', ''))

const typeAlignment = computed(() => {
  const parts = []
  if (props.beast.size) parts.push(props.beast.size)
  if (props.beast.type) parts.push(props.beast.type)
  if (props.beast.alignment) parts.push(props.beast.alignment)
  return parts.join(', ')
})
const initMod = computed(() => (props.beast.stats?.dex ? abilityMod(props.beast.stats.dex) : 0))
const monsterUrl = computed(() => {
  const anchor = props.beast.name.replace(/[^A-Za-z]/g, '')
  return `https://www.dndbeyond.com/sources/dnd/mm-2024/animals#${anchor}`
})
const skillsText = computed(() => {
  if (!props.beast.skills) return ''
  return Object.entries(props.beast.skills)
    .map(([k, v]) => `${cap(k)} +${v}`)
    .join(', ')
})
const sensesText = computed(() => {
  if (!props.beast.senses) return ''
  return Object.entries(props.beast.senses)
    .map(([k, v]) => (k === 'passivePerception' ? `Passive Perception ${v}` : `${cap(k)} ${v}`))
    .join('; ')
})
const arrTxt = (arr) => {
  if (!arr) return ''
  if (Array.isArray(arr)) return arr.join(', ')
  if (typeof arr === 'string') return arr
  return ''
}
const resistText = computed(() => arrTxt(props.beast.resistances))
const immuneText = computed(() => arrTxt(props.beast.immunities))
const hasSwim = computed(() => !!props.beast.speed?.swimSpeed)
const hasFly = computed(() => !!props.beast.speed?.flySpeed)
const conditionText = computed(() => {
  const src = [
    ...(props.beast.actions || []).map((a) => a.description || ''),
    ...(props.beast.traits || []).map((t) => t.description || ''),
  ]
    .join(' ')
    .toLowerCase()
  const keywords = [
    'grappled',
    'prone',
    'restrained',
    'poisoned',
    'blinded',
    'frightened',
    'stunned',
  ]
  const found = keywords.filter((k) => src.includes(k))
  return found.length ? found.map((k) => cap(k)).join(', ') : ''
})

// CR class helper
const getCRClass = (cr) => {
  const crNum = parseFloat(cr)
  if (crNum >= 4) return 'cr-high'
  if (crNum >= 2) return 'cr-medium'
  return 'cr-low'
}

// Format spellcasting text
const formatSpellcasting = (text) => {
  if (!text) return text

  // Format "At will" og "1/day" osv.
  let formatted = text
    .replace(/At will\s*–?/gi, '<br><strong>At Will:</strong>')
    .replace(/(\d+\/day)\s*–?/gi, '<br><strong>$1:</strong>')

  // Fjern leading <br> hvis det er første linje
  if (formatted.startsWith('<br>')) {
    formatted = formatted.substring(4)
  }

  return formatted
}

// Helper to check if item is last in object
const isLastItem = (key, obj) => {
  const keys = Object.keys(obj)
  return keys[keys.length - 1] === key
}

// ref for auto-scroll
const cardRef = ref(null)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/********** ICONS **********/
.icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke: none;
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
}

.icon.tag {
  width: 1rem;
  height: 1rem;
  margin-left: 0.25rem;
}

.star-outline {
  color: #fbbf24;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.star-filled {
  color: #fbbf24;
  fill: #fbbf24;
  filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.5));
}

.chevron-up,
.chevron-down {
  color: #737373;
  stroke-width: 2;
  fill: none;
}

.swim-icon {
  color: #0891b2;
}

.fly-icon {
  color: #7c3aed;
}

.climb-icon {
  color: #ea580c;
}

.burrow-icon {
  color: #854d0e;
}

/********** CARD CONTAINER **********/
.beast-card {
  background: #1a1a1a;
  border: 1px solid #262626;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #e5e5e5;
  width: 100%;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.beast-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #dc2626 50%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.beast-card:hover {
  transform: translateY(-2px);
  border-color: #404040;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.beast-card:hover::before {
  opacity: 1;
}

.beast-card.collapsed .detail-body {
  display: none;
}

/********** CR BADGE **********/
.cr-badge {
  position: absolute;
  top: -1px;
  right: -1px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0 0.75rem 0 0.75rem;
  border: 1px solid;
}

.cr-badge.cr-low {
  background: #166534;
  border-color: #16a34a;
  color: #bbf7d0;
}

.cr-badge.cr-medium {
  background: #a16207;
  border-color: #fbbf24;
  color: #fef3c7;
}

.cr-badge.cr-high {
  background: #991b1b;
  border-color: #dc2626;
  color: #fecaca;
}

/********** TITLE ROW **********/
.title-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding-right: 5rem; /* Øget fra 3rem til 5rem for at undgå overlap med CR badge */
}

.title-col {
  flex: 1 1 auto;
  min-width: 0;
}

.name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.name a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.name a:hover {
  color: #dc2626;
}

.title-badges {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.subline {
  font-size: 0.8125rem;
  margin: 0;
  color: #737373;
}

/********** THUMBNAILS **********/
.token-thumb {
  width: 56px;
  height: 56px;
  object-fit: contain;
  object-position: center;
  border-radius: 0.5rem;
  flex-shrink: 0;
  background: #262626;
  border: 1px solid #404040;
}

.detail-thumb {
  width: 96px;
  height: 96px;
  margin-left: auto;
  border-radius: 0.625rem;
}

/********** ACTION BUTTONS **********/
.title-actions {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  top: 2.5rem; /* Flyttet ned fra 1.25rem for at undgå overlap med CR badge */
  right: 1.25rem;
}

.icon-btn {
  background: #262626;
  border: 1px solid #404040;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #404040;
  border-color: #525252;
}

.star-btn:hover {
  border-color: #fbbf24;
  background: #fbbf2415;
}

.toggle-btn[disabled] {
  opacity: 0.3;
  cursor: default;
}

/********** CORE STATS **********/
.core-thumb-row {
  display: flex;
  gap: 1.2rem;
}

.core dl {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin: 0;
}

.core dl div {
  display: flex;
  gap: 0.5rem;
}

.core dt {
  font-weight: 600;
  color: #a3a3a3;
  min-width: 4.5rem;
}

.core dd {
  margin: 0;
  color: #e5e5e5;
}

.stat-value {
  font-weight: 600;
  color: #fbbf24;
}

.speed-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.speed-list div {
  white-space: nowrap;
  padding: 0.125rem 0.375rem;
  background: #262626;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
}

.condition-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/********** LINK STYLES **********/
.skill-link,
.sense-link,
.condition-link,
.damage-type-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted #dc2626;
  transition: all 0.2s;
}

.skill-link:hover,
.sense-link:hover,
.condition-link:hover,
.damage-type-link:hover {
  color: #dc2626;
  border-bottom-style: solid;
}

.skill-item,
.sense-item {
  white-space: nowrap;
}

.senses-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.condition-tag {
  padding: 0.125rem 0.375rem;
  background: #dc26261a;
  border: 1px solid #dc262633;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.condition-tag a {
  color: inherit;
}

/********** ABILITY TABLE **********/
.ability-table {
  margin: 0.5rem 0;
}

.ability-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 0.5rem;
}

.ability-table th,
.ability-table td {
  text-align: center;
  padding: 0.625rem;
  font-size: 0.875rem;
}

.ability-table th {
  background: #262626;
  color: #a3a3a3;
  font-weight: 600;
  border-bottom: 1px solid #404040;
}

.ability-table td {
  background: #1a1a1a;
  border-right: 1px solid #262626;
}

.ability-table td:last-child {
  border-right: none;
}

.ability-table .score {
  font-weight: 600;
  color: #ffffff;
  display: block;
}

.ability-table .mod {
  display: block;
  font-size: 0.75rem;
  color: #737373;
}

/********** SECTIONS **********/
.section-title {
  margin: 1.25rem 0 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #dc2626;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #dc262633;
}

.skills {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #e5e5e5;
}

.skills strong {
  color: #a3a3a3;
}

.traits,
.actions,
.bonus-actions,
.reactions {
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: #e5e5e5;
}

.ability-item {
  padding: 0.75rem;
  background: #26262615;
  border-left: 3px solid #404040;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.ability-item:hover {
  background: #26262625;
  border-left-color: #dc2626;
}

.ability-item strong {
  color: #ffffff;
  font-weight: 600;
}

/********** RESPONSIVE **********/
@media (max-width: 640px) {
  .beast-card {
    padding: 1rem;
  }

  .title-row {
    padding-right: 4rem; /* Reduceret lidt for mobile */
  }

  .title-actions {
    top: 2rem; /* Justeret for mobile */
    right: 1rem;
    flex-direction: column;
    gap: 0.25rem;
  }

  .icon-btn {
    padding: 0.375rem;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }
}

/********** COMPACT MODE **********/
.compact-thumb {
  width: 48px !important;
  height: 48px !important;
}
</style>
