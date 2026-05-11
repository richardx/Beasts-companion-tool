const BASE_URL = 'https://www.dndbeyond.com';
const RULES_URL = `${BASE_URL}/sources/basic-rules`;

const SKILL_MAP = {
  acrobatics: 'Acrobatics',
  animalhandling: 'AnimalHandling',
  arcana: 'Arcana',
  athletics: 'Athletics',
  deception: 'Deception',
  history: 'History',
  insight: 'Insight',
  intimidation: 'Intimidation',
  investigation: 'Investigation',
  medicine: 'Medicine',
  nature: 'Nature',
  perception: 'Perception',
  performance: 'Performance',
  persuasion: 'Persuasion',
  religion: 'Religion',
  sleightofhand: 'SleightofHand',
  stealth: 'Stealth',
  survival: 'Survival',
};

const CONDITION_MAP = {
  blinded: 'Blinded',
  charmed: 'Charmed',
  deafened: 'Deafened',
  exhaustion: 'Exhaustion',
  frightened: 'Frightened',
  grappled: 'Grappled',
  incapacitated: 'Incapacitated',
  invisible: 'Invisible',
  paralyzed: 'Paralyzed',
  petrified: 'Petrified',
  poisoned: 'Poisoned',
  prone: 'Prone',
  restrained: 'Restrained',
  stunned: 'Stunned',
  unconscious: 'Unconscious',
};

const SENSE_MAP = {
  blindsight: 'Blindsight',
  darkvision: 'Darkvision',
  tremorsense: 'Tremorsense',
  truesight: 'Truesight',
};

export const getSkillLink = (skillName) => {
  const normalized = skillName.toLowerCase().replace(/\s+/g, '');
  const mapped = SKILL_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/using-ability-scores#${mapped}`;
};

export const getConditionLink = (condition) => {
  const normalized = condition.toLowerCase();
  const mapped = CONDITION_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/appendix-a-conditions#${mapped}`;
};

export const getSenseLink = (sense) => {
  const normalized = sense.toLowerCase();
  const mapped = SENSE_MAP[normalized];
  if (!mapped) return null;
  return `${RULES_URL}/monsters#${mapped}`;
};
