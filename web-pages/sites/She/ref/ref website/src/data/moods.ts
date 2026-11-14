export type MoodId =
  | 'comfort'
  | 'sleepy'
  | 'annoyed'
  | 'entertainment'
  | 'missing'
  | 'sweets'
  | 'overwhelmed'
  | 'happy';

export interface MoodDefinition {
  id: MoodId;
  emoji: string;
  label: string;
  shortLabel: string;
  pillTint: string;
  cardBg: string;
  accentColor: string;
  greeting: string;
  message: string;
  closingNote?: string;
}

export const MOODS: MoodDefinition[] = [
  {
    id: 'comfort',
    emoji: '🥺',
    label: '🥺 Need comfort',
    shortLabel: 'Need comfort',
    pillTint: 'bg-[#FCE7F3] border-[#F5C6DE] text-[#3F2E2E]',
    cardBg: 'bg-[#FFF9FB]',
    accentColor: '#E598B8',
    greeting: 'my girl. Come here 🫂',
    message:
      "No need to explain anything or pretend you're okay. Take a deep breath, relax those little shoulders, and imagine me giving you the tightest hug ever. I'm right here, okay? ❤️",
  },
  {
    id: 'sleepy',
    emoji: '😴',
    label: '😴 Sleepy',
    shortLabel: 'Sleepy',
    pillTint: 'bg-[#EDE9FE] border-[#DDD6FE] text-[#3F2E2E]',
    cardBg: 'bg-[#FAF8FF]',
    accentColor: '#A78BFA',
    greeting: "Someone's running low on battery! 😂",
    message:
      'Go get some rest, sleepyhead. The world can wait. Consider this your virtual forehead kiss and blanket tuck-in. Sweet dreams, kutty. 😚',
  },
  {
    id: 'annoyed',
    emoji: '😒',
    label: '😒 Annoyed',
    shortLabel: 'Annoyed',
    pillTint: 'bg-[#FFEDD5] border-[#FED7AA] text-[#3F2E2E]',
    cardBg: 'bg-[#FFFBF6]',
    accentColor: '#FB923C',
    greeting: "Ohooo, who's troubling my favourite human? 👀",
    message:
      'First, relax. Second, you are allowed to be annoyed, no need to pretend that youre fine. Third, I volunteer to listen to the entire rant without judging. Proceed, madam. 😂',
  },
  {
    id: 'entertainment',
    emoji: '😎',
    label: '😎 Need entertainment',
    shortLabel: 'Need entertainment',
    pillTint: 'bg-[#FEF3C7] border-[#FDE68A] text-[#3F2E2E]',
    cardBg: 'bg-[#FFFDF5]',
    accentColor: '#D97706',
    greeting: 'Emergency entertainment department reporting for duty! 🫡',
    message:
      'Your options: one terrible joke, one random question, unlimited teasing, or a completely unnecessary debate. Choose your weapon. 😂',
  },
  {
    id: 'missing',
    emoji: '💙',
    label: '💙 Missing you',
    shortLabel: 'Missing you',
    pillTint: 'bg-[#DBEAFE] border-[#BFDBFE] text-[#3F2E2E]',
    cardBg: 'bg-[#F8FAFF]',
    accentColor: '#3B82F6',
    greeting: 'Awww, caught you missing me!',
    message:
      "Well, plot twist… I'm probably missing you too. Wish I could teleport for one hug, hold your hand for a while, and just sit beside you. Until then, here's a little piece of me. 🫂",
  },
  {
    id: 'sweets',
    emoji: '🍫',
    label: '🍫 Craving sweets',
    shortLabel: 'Craving sweets',
    pillTint: 'bg-[#FEF3C7] border-[#FCD34D] text-[#3F2E2E]',
    cardBg: 'bg-[#FFFDF4]',
    accentColor: '#B45309',
    greeting: 'Sweet tooth detected! 🚨',
    message:
      "I prescribe one tiramisu, one KitKat waffle and absolutely zero guilt. Unfortunately, I can't deliver them through this screen yet. Technology, please catch up. 😭❤️",
  },
  {
    id: 'overwhelmed',
    emoji: '🥹',
    label: '🥹 Overwhelmed',
    shortLabel: 'Overwhelmed',
    pillTint: 'bg-[#E2ECE9] border-[#C6DCD6] text-[#3F2E2E]',
    cardBg: 'bg-[#F8FCFB]',
    accentColor: '#5B9A8B',
    greeting: 'Sree, one thing at a time, okay?',
    message:
      "You don't have to figure everything out today. Pause, drink some water, breathe and give yourself a little kindness. I'm proud of you, even on the messy days. ❤️",
  },
  {
    id: 'happy',
    emoji: '🥰',
    label: '🥰 Feeling happy',
    shortLabel: 'Feeling happy',
    pillTint: 'bg-[#FCE7F3] border-[#F9A8D4] text-[#3F2E2E]',
    cardBg: 'bg-[#FFF9FB]',
    accentColor: '#DB2777',
    greeting: 'WAITTT! LOOK AT YOU BEING HAPPY! 🥹',
    message:
      'I hope you know how lovely it is when you’re happy. Whatever made you smile today, I hope you get a hundred more moments like that. Save some of that happiness for me too! ❤️',
  },
];
