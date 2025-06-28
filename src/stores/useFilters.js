import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useFilters = defineStore('filters', {
  state: () => ({
    q:      useStorage('filt:q', ''),
    crMin:  useStorage('filt:crMin', 0),     // Tilføjet
    crMax:  useStorage('filt:crMax', 6),
    moves:  useStorage('filt:moves', []),    
    senses: useStorage('filt:senses', []),   
  }),
  
  /* ───────────── GETTERS ───────────── */
  getters: {
    /** Callback der kan mappes direkte på din beasts-liste */
    predicate: (s) => (beast) => {
      /* ---------- søgning i navn & traits ---------- */
      const qLow = s.q.toLowerCase()
      const textHit =
        !s.q ||
        beast.name.toLowerCase().includes(qLow) ||
        (beast.traits ?? []).some((t) =>
          `${t.name}${t.description}`.toLowerCase().includes(qLow)
        )
      
      /* ---------- CR range check ---------- */
      const beastCR = parseFloat(beast.cr) || 0
      const crHit = beastCR >= s.crMin && beastCR <= s.crMax
      
      /* ---------- Movement ---------- */
      const moveHit =
        !s.moves.length ||
        s.moves.every((m) => beast.speed?.[`${m}Speed`] !== undefined)
      
      /* ---------- Senses (valgfri) ---------- */
      const senseHit =
        !s.senses.length ||
        s.senses.every((sn) => beast.senses?.[sn] !== undefined)
      
      return textHit && crHit && moveHit && senseHit
    },
  },
  
  /* ───────────── ACTIONS ───────────── */
  actions: {
    reset() {
      this.q = ''
      this.crMin = 0
      this.crMax = 6
      this.moves = []
      this.senses = []
    },
    toggleMove(m) {
      this.moves = this.moves.includes(m)
        ? this.moves.filter((x) => x !== m)
        : [...this.moves, m]
    },
    toggleSense(s) {
      this.senses = this.senses.includes(s)
        ? this.senses.filter((x) => x !== s)
        : [...this.senses, s]
    },
  },
})