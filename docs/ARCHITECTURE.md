# Architecture

## Component tree

```
App.vue
└── HomeView.vue
    ├── FilterBar.vue        ← horisontal inline filterbar (kun wildshape-fanen)
    ├── BeastCard.vue (×N)   ← one per beast in filtered list
    └── NotesPanel.vue       ← collapsibelt noter-panel i højre side
```

Active beasts are rendered as a second set of `BeastCard` at the top of `HomeView` with `lock-expanded` prop set, so they always show the full stat block.

## State management

Two Pinia stores:

### `useFilters` ([src/stores/useFilters.js](../src/stores/useFilters.js))

Holds all filter state. Every field is wired to `localStorage` via VueUse `useStorage`, so filters survive page reloads automatically.

| Field | Type | Default | Description |
|---|---|---|---|
| `q` | string | `''` | Free-text search (name + traits) |
| `crMin` | number | `0` | Minimum CR |
| `crMax` | number | `6` | Maximum CR |
| `moves` | string[] | `[]` | Required movement types: `'fly'`, `'swim'`, `'burrow'`, `'climb'` |
| `senses` | string[] | `[]` | Required senses: `'blindsight'`, `'darkvision'`, `'tremorsense'` |

The `predicate` getter returns a function `(beast) => boolean` that `HomeView` passes directly to `Array.filter()`.

### `useActiveBeasts` ([src/stores/activeBeasts.js](../src/stores/activeBeasts.js))

Tracks the player's currently active wildshape forms. Persists manually to `localStorage` under key `activeBeasts`.

- Max **4** active beasts at a time
- `toggle(beast)` — adds if not present and list < 4, removes if already present
- `clear()` — empties the list

## Data flow

```
beasts.json  ──import──►  HomeView
                               │
                     filters.predicate
                               │
                          filtered []  ──sort──►  <BeastCard v-for>
                               │
                     active.toggle()
                               │
                          active.list  ──►  Active Beasts section (top)
```

## Sorting

All sorting happens inside the `beasts` computed property in `HomeView`. Sort key and direction are local `ref` state (not persisted). Available sort keys:

`name` · `cr` · `type` · `hp` · `ac` · `speed` · `size` · `movement` · `str` · `con`

CR sorting uses `parseCR()` to handle fractional values (`1/8`, `1/4`, `1/2`).  
Size sorting uses a hardcoded order map: Tiny → Small → Medium → Large → Huge → Gargantuan.

## Tabs

`HomeView` has a local `activeTab` ref (`'wildshape'` | `'polymorph'`). On wildshape: `beasts.json` is filtered and sorted via `useFilters`. On polymorph: `polymorph.json` is returned directly (no filtering). The toolbar and `FilterBar` are hidden on the polymorph tab.

## Notes panel

`NotesPanel.vue` is a collapsible panel on the right side of the page. Open/closed state and note content are both persisted to `localStorage` via `useStorage` (`notes-open`, `combat-notes`). No backend required.

## Expand/collapse

Each `BeastCard` manages its own `expanded` state. `HomeView` broadcasts a native `CustomEvent('toggle-all-beasts')` on `window` when the user clicks "Expand All / Collapse All" — cards listen for this event and update accordingly. Active beast cards receive `lock-expanded` and ignore collapse events.

