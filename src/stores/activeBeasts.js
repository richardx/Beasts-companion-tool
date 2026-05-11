import { defineStore } from 'pinia'

export const useActiveBeasts = defineStore('activeBeasts', {
  state: () => ({
    wildshape: loadFromLocal('activeWildshape'),
    polymorph: loadFromLocal('activePolymorph'),
  }),

  getters: {
    containsWildshape: (state) => (name) => state.wildshape?.name === name,
    containsPolymorph: (state) => (name) => state.polymorph?.name === name,
  },

  actions: {
    toggle(beast, type = 'wildshape') {
      if (type === 'polymorph') {
        this.polymorph = this.polymorph?.name === beast.name ? null : beast
      } else {
        this.wildshape = this.wildshape?.name === beast.name ? null : beast
      }
      this.persist()
    },

    clear() {
      this.wildshape = null
      this.polymorph = null
      this.persist()
    },

    persist() {
      localStorage.setItem('activeWildshape', JSON.stringify(this.wildshape))
      localStorage.setItem('activePolymorph', JSON.stringify(this.polymorph))
    },
  },
})

function loadFromLocal(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
