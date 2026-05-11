# Beast Data Format

All beast data lives in [src/assets/beasts.json](../src/assets/beasts.json). The file is a JSON array of beast objects.

## Full schema

```jsonc
{
  "name": "Allosaurus",          // string — used as unique ID, must match image filename
  "cr": "2",                     // string — "0", "1/8", "1/4", "1/2", "1" … "8"
  "crNumeric": 2.0,              // number — pre-parsed float version of cr
  "xp": 0,                       // number — XP reward (often 0 in current data)
  "proficiencyBonus": null,      // number | null
  "ac": 13,                      // number — Armor Class
  "hp": "51 (6d10 + 18)",        // string — HP with dice formula
  "size": "Large",               // string — Tiny/Small/Medium/Large/Huge/Gargantuan
  "type": "Beast, Unaligned",    // string — creature type + alignment

  "speed": {
    "walkSpeed": "60 ft.",       // string | undefined
    "flySpeed":  "60 ft.",       // string | undefined
    "swimSpeed": "40 ft.",       // string | undefined
    "climbSpeed": "30 ft.",      // string | undefined
    "burrowSpeed": "20 ft."      // string | undefined
    // only the speeds the beast actually has are present
  },

  "stats": {
    "str": 19,                   // number | null
    "dex": 13,                   // number | null
    "con": 17,                   // number | null
    "int": null,                 // null for beasts with no INT score
    "wis": null,
    "cha": null
  },

  "skills": {                    // object | undefined — only skills the beast has
    "perception": 5,
    "stealth": 7
    // keys are lowercase skill names, values are the total bonus
  },

  "senses": {
    "passivePerception": 15,     // number — always present
    "darkvision": "60 ft.",      // string | undefined
    "blindsight": "30 ft.",      // string | undefined
    "tremorsense": "60 ft."      // string | undefined
  },

  "traits": [                    // array | undefined — passive abilities
    {
      "name": "Amphibious",
      "description": "Can breathe air and water"
    }
  ],

  "actions": [                   // array | undefined — standard actions
    {
      "name": "Bite",
      "description": "Attack bonus 6, Reach 5 ft., Damage 2d10+4, Type piercing"
    }
  ],

  "bonusActions": [              // array | undefined — bonus actions
    {
      "name": "Nimble Escape",
      "description": "The tiger takes the Disengage or Hide action."
    }
  ],

  "reactions": [                 // array | undefined
    {
      "name": "...",
      "description": "..."
    }
  ],

  "conditions": ["Prone"],       // string[] | undefined — conditions the beast can inflict

  "initiative": 3                // number | undefined — initiative bonus
}
```

## Notes

- `name` doubles as the image filename. A beast named `"Dire Wolf"` expects `beast_images/Dire Wolf.webp`. Spaces are literal — no URL encoding needed (Vite handles it).
- `cr` is always a string to preserve fractions (`"1/8"` etc.). `crNumeric` is the pre-computed float for sorting. If you add a beast manually, set both.
- Missing optional fields (`traits`, `bonusActions`, `reactions`, `conditions`) should be omitted entirely rather than set to `null` or `[]`.
- Skill and sense keys are camelCase: `passivePerception`, `darkvision`, `flySpeed`.
- The filter store checks movement with `beast.speed?.[m + 'Speed'] !== undefined`, so the key must be exactly `flySpeed`, `swimSpeed`, `burrowSpeed`, or `climbSpeed`.

## Adding a new beast

1. Add the beast object to `src/assets/beasts.json` following the schema above.
2. Drop a `.webp` image in `beast_images/` named exactly `<beast.name>.webp`.
3. The beast will appear automatically on next `npm run dev` — no registration needed.

Images from 5etools can be downloaded with the helper script [download_5etools_images.py](../download_5etools_images.py).
