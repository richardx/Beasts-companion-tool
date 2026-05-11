# Druid Beast Companion Tool

A Vue 3 + Tauri desktop app for a DnD 5e (2024) campaign. The druid player uses it to browse and track which wildshape forms they have active.

## What it does

- Shows 90 beasts from D&D 2024 Player's Handbook with full stat blocks
- Lets the player pin up to **4 active beasts** (their current wildshape options) at the top
- Filter sidebar: text search, CR range slider, movement types (fly/swim/burrow/climb), senses
- Sort by name, CR, HP, AC, speed, size, STR, CON, movement type
- Grid and compact list view modes
- All filter/active state persists in localStorage

## Tech stack

- **Vue 3** with Composition API (`<script setup>`)
- **Vite** as build tool
- **Pinia** for state (two stores: `useFilters`, `useActiveBeasts`)
- **VueUse** `useStorage` for auto-persisting filter state
- All styling is scoped CSS in `.vue` files

## Key files

- [src/views/HomeView.vue](src/views/HomeView.vue) — main page, filtering/sorting logic
- [src/components/BeastCard.vue](src/components/BeastCard.vue) — collapsible stat block card
- [src/components/FilterSidebar.vue](src/components/FilterSidebar.vue) — filter panel (desktop sidebar / mobile overlay)
- [src/stores/useFilters.js](src/stores/useFilters.js) — filter state + `predicate` getter
- [src/stores/activeBeasts.js](src/stores/activeBeasts.js) — active beast list (max 4), localStorage
- [src/assets/beasts.json](src/assets/beasts.json) — all 90 beast definitions
- [beast_images/](beast_images/) — `.webp` token images, one per beast (filename = beast name)

## Running the app

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Important gotchas

- CR is stored as a string (`"1/8"`, `"1/4"`, `"1/2"`, `"0"`, `"1"` …). `parseCR()` in HomeView converts to float for sorting/filtering.
- Active beasts cap is **4** (not 3 as the old README says — check `activeBeasts.js` line 25).
- Beast images are loaded by filename: `beast_images/<beast.name>.webp`. The card falls back to a placeholder on 404.
- Filter state uses VueUse `useStorage` keys prefixed `filt:` — clearing localStorage resets all filters.
- `toggle-all-beasts` is a native `CustomEvent` dispatched on `window` — BeastCard listens for it to expand/collapse.

## Data format

See [docs/DATA_FORMAT.md](docs/DATA_FORMAT.md) for the full beasts.json schema.

## Working rules for Claude

### Always explain first, act second

Before making any code change, describe what you intend to do and why. Wait for explicit approval before editing files. This applies to all changes, not just the ones listed below.

### Require explicit approval before

- **Deleting or moving files** — including beast images, components, and JSON data
- **Editing `src/assets/beasts.json`** — beast data is curated; changes are hard to recover without git
- **Editing either Pinia store** (`useFilters.js`, `activeBeasts.js`) — these are the core of the app logic; bugs here break persistence and filtering silently

### Keep documentation up to date

After any change that affects how the app works, update the relevant docs as part of the same task — not as a separate follow-up:

- **README.md** — update if features, scripts, or setup steps change
- **docs/ARCHITECTURE.md** — update if components, stores, data flow, or build setup changes
- **docs/DATA_FORMAT.md** — update if the beasts.json schema changes

Only document things that are genuinely useful to know. Don't add documentation for internal implementation details that are already clear from reading the code.

### General coding principles

- Do not add abstractions, helpers, or refactors beyond what the task explicitly requires
- Do not add comments explaining what the code does — only add a comment if the *why* is non-obvious
- Do not add error handling or fallbacks for scenarios that cannot realistically happen
- Prefer editing existing files over creating new ones
- Match the existing code style (scoped CSS in `.vue` files, Composition API `<script setup>`)
