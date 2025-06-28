// D&D Beyond link generator utilities

// Base URLs
const BASE_URL = 'https://www.dndbeyond.com';
const RULES_URL = `${BASE_URL}/sources/basic-rules`;

// Skill name mapping
const SKILL_MAP = {
  'acrobatics': 'Acrobatics',
  'animalhandling': 'AnimalHandling',
  'arcana': 'Arcana',
  'athletics': 'Athletics',
  'deception': 'Deception',
  'history': 'History',
  'insight': 'Insight',
  'intimidation': 'Intimidation',
  'investigation': 'Investigation',
  'medicine': 'Medicine',
  'nature': 'Nature',
  'perception': 'Perception',
  'performance': 'Performance',
  'persuasion': 'Persuasion',
  'religion': 'Religion',
  'sleightofhand': 'SleightofHand',
  'stealth': 'Stealth',
  'survival': 'Survival'
};

// Condition name mapping
const CONDITION_MAP = {
  'blinded': 'Blinded',
  'charmed': 'Charmed',
  'deafened': 'Deafened',
  'exhaustion': 'Exhaustion',
  'frightened': 'Frightened',
  'grappled': 'Grappled',
  'incapacitated': 'Incapacitated',
  'invisible': 'Invisible',
  'paralyzed': 'Paralyzed',
  'petrified': 'Petrified',
  'poisoned': 'Poisoned',
  'prone': 'Prone',
  'restrained': 'Restrained',
  'stunned': 'Stunned',
  'unconscious': 'Unconscious'
};

// Sense type mapping
const SENSE_MAP = {
  'blindsight': 'Blindsight',
  'darkvision': 'Darkvision',
  'tremorsense': 'Tremorsense',
  'truesight': 'Truesight'
};

// Damage type mapping
const DAMAGE_TYPE_MAP = {
  'acid': 'Acid',
  'bludgeoning': 'Bludgeoning',
  'cold': 'Cold',
  'fire': 'Fire',
  'force': 'Force',
  'lightning': 'Lightning',
  'necrotic': 'Necrotic',
  'piercing': 'Piercing',
  'poison': 'Poison',
  'psychic': 'Psychic',
  'radiant': 'Radiant',
  'slashing': 'Slashing',
  'thunder': 'Thunder'
};

// Generate skill link
export const getSkillLink = (skillName) => {
  const normalized = skillName.toLowerCase().replace(/\s+/g, '');
  const mapped = SKILL_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/using-ability-scores#${mapped}`;
};

// Generate condition link
export const getConditionLink = (condition) => {
  const normalized = condition.toLowerCase();
  const mapped = CONDITION_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/appendix-a-conditions#${mapped}`;
};

// Generate sense link
export const getSenseLink = (sense) => {
  const normalized = sense.toLowerCase();
  const mapped = SENSE_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/monsters#${mapped}`;
};

// Generate damage type link
export const getDamageTypeLink = (damageType) => {
  const normalized = damageType.toLowerCase();
  const mapped = DAMAGE_TYPE_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/damage-and-healing#DamageTypes`;
};

// Parse text and create links for conditions
export const linkifyConditions = (text) => {
  if (!text) return text;
  
  let result = text;
  Object.entries(CONDITION_MAP).forEach(([key]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      const link = getConditionLink(match);
      return link ? `<a href="${link}" target="_blank" class="condition-link">${match}</a>` : match;
    });
  });
  
  return result;
};

// Parse text and create links for damage types
export const linkifyDamageTypes = (text) => {
  if (!text) return text;
  
  let result = text;
  Object.entries(DAMAGE_TYPE_MAP).forEach(([key]) => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      const link = getDamageTypeLink(match);
      return link ? `<a href="${link}" target="_blank" class="damage-type-link">${match}</a>` : match;
    });
  });
  
  return result;
};

// Check if a link should be generated
export const shouldLinkify = (text, type) => {
  const normalized = text.toLowerCase();
  switch (type) {
    case 'skill':
      return Object.prototype.hasOwnProperty.call(SKILL_MAP, normalized.replace(/\s+/g, ''));
    case 'condition':
      return Object.prototype.hasOwnProperty.call(CONDITION_MAP, normalized);
    case 'sense':
      return Object.prototype.hasOwnProperty.call(SENSE_MAP, normalized);
    case 'damage':
      return Object.prototype.hasOwnProperty.call(DAMAGE_TYPE_MAP, normalized);
    default:
      return false;
  }
};