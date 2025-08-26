import { defineStore } from 'pinia'

const STORAGE_KEY = 'activeBeasts'

export const useActiveBeasts = defineStore('activeBeasts', {
  // ────────────────────────────────────────────────
  state: () => ({
    /** @type {Array<Object>} */
    list: loadFromLocal(),
  }),

  // ────────────────────────────────────────────────
  getters: {
    /** true hvis navnet allerede ligger i listen */
    contains: (state) => (name) =>
      state.list.some((b) => b.name === name),
  },

  // ────────────────────────────────────────────────
  actions: {
    /** Tilføj/fjern – og gem bagefter */
    toggle(beast) {
      if (this.contains(beast.name)) {
        this.list = this.list.filter((b) => b.name !== beast.name)
      } else if (this.list.length < 4) {
        this.list.push(beast)
      }
      this.persist()
    },

    /** Tøm hele listen */
    clear() {
      this.list = []
      this.persist()
    },

    /** Skriv til localStorage */
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list))
    },
  },
})

/* ───────── helpers ───────── */
function loadFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
