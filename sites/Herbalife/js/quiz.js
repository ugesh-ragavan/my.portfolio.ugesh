// 10 General Health & Nutrition Quiz Questions
export const HEALTH_QUIZ_POOL = [
  {
    id: 1,
    category: "Daily Hydration",
    question: "How many liters of water should an active individual drink daily for optimal vitality and metabolism?",
    options: [
      { text: "Less than 1 liter", isCorrect: false },
      { text: "2.5 to 3.5 Liters (approx 8-12 glasses)", isCorrect: true },
      { text: "15 liters all at once", isCorrect: false },
      { text: "Water is only needed when feeling dizzy", isCorrect: false }
    ],
    tip: "Staying hydrated boosts energy, flushes toxins, and keeps your skin clear and glowing!"
  },
  {
    id: 2,
    category: "Morning Nutrition",
    question: "Why is breakfast considered the most crucial meal of the day?",
    options: [
      { text: "It 'breaks the fast' of 8+ hours and kickstarts your daily metabolism", isCorrect: true },
      { text: "It makes you sleepy immediately", isCorrect: false },
      { text: "It only matters if you are an Olympic athlete", isCorrect: false },
      { text: "It is better to skip it to save time", isCorrect: false }
    ],
    tip: "A balanced high-protein breakfast prevents mid-day energy crashes and sugar cravings."
  },
  {
    id: 3,
    category: "Muscle & Protein",
    question: "What is the recommended daily protein intake for an average active adult?",
    options: [
      { text: "Zero protein", isCorrect: false },
      { text: "Around 1.0g to 1.5g of protein per kilogram of body weight", isCorrect: true },
      { text: "500g of pure butter", isCorrect: false },
      { text: "Only 5g for the whole week", isCorrect: false }
    ],
    tip: "Adequate protein preserves lean muscle, burns calories, and keeps you feeling full longer."
  },
  {
    id: 4,
    category: "Sleep & Recovery",
    question: "How many hours of quality sleep are recommended for cell repair and immune recovery?",
    options: [
      { text: "2 to 3 hours with TV on", isCorrect: false },
      { text: "7 to 8 hours of restful, uninterrupted sleep", isCorrect: true },
      { text: "18 hours every weekend only", isCorrect: false },
      { text: "Sleep is not necessary for wellness", isCorrect: false }
    ],
    tip: "Deep sleep allows your hormones to balance, your brain to detoxify, and muscles to rebuild."
  },
  {
    id: 5,
    category: "Metabolism & Antioxidants",
    question: "What natural compound found in Green Tea & Afresh helps revitalize metabolism and fight free radicals?",
    options: [
      { text: "Polyphenols & Natural Antioxidants", isCorrect: true },
      { text: "Artificial Food Coloring", isCorrect: false },
      { text: "Excess Saturated Fat", isCorrect: false },
      { text: "Refined Table Sugar", isCorrect: false }
    ],
    tip: "Green tea antioxidants protect cells from oxidative stress and gently rev up fat burning."
  },
  {
    id: 6,
    category: "Digestive Health",
    question: "Which plant extract is world-renowned for supporting gut soothing and healthy digestion?",
    options: [
      { text: "Aloe Vera", isCorrect: true },
      { text: "Spicy Ghost Pepper", isCorrect: false },
      { text: "Heavy Mayonnaise", isCorrect: false },
      { text: "Deep-fried batter", isCorrect: false }
    ],
    tip: "Herbal Aloe Concentrate contains prebiotic properties that support microflora and digestion."
  },
  {
    id: 7,
    category: "Fiber Power",
    question: "Why is dietary fiber (like active oat-apple fiber) vital for daily health?",
    options: [
      { text: "It supports regular bowel movements and healthy cholesterol levels", isCorrect: true },
      { text: "It has zero role in the body", isCorrect: false },
      { text: "It slows down healthy absorption", isCorrect: false },
      { text: "It causes instant fatigue", isCorrect: false }
    ],
    tip: "Eating 25g+ of daily fiber keeps your digestive tract clean and controls blood glucose spikes."
  },
  {
    id: 8,
    category: "Vitamins & Micronutrients",
    question: "How many essential vitamins and minerals does a standard Herbalife Formula 1 shake deliver?",
    options: [
      { text: "Only 1 vitamin", isCorrect: false },
      { text: "Up to 21 essential vitamins, minerals, and micronutrients", isCorrect: true },
      { text: "Zero vitamins", isCorrect: false },
      { text: "Only table salt", isCorrect: false }
    ],
    tip: "Formula 1 is scientifically formulated to provide full micronutrient density in every serving."
  },
  {
    id: 9,
    category: "Active Lifestyle",
    question: "How many steps or minutes of moderate physical activity per day is recommended by health experts?",
    options: [
      { text: "30 minutes of brisk walking or ~8,000 to 10,000 steps", isCorrect: true },
      { text: "Zero movement, full bed rest", isCorrect: false },
      { text: "10 hours of marathon running daily", isCorrect: false },
      { text: "Walking only 100 meters per week", isCorrect: false }
    ],
    tip: "Just 30 minutes of brisk walking every day lowers cardiovascular risk by over 30%."
  },
  {
    id: 10,
    category: "Healthy Snacking",
    question: "Which of the following is an ideal guilt-free evening snack?",
    options: [
      { text: "Steamed Poha Dumplings or Roasted Millet Snack / Protein Bar", isCorrect: true },
      { text: "Sugary cream donuts", isCorrect: false },
      { text: "Deep-fried potato crisps", isCorrect: false },
      { text: "Carbonated sugar beverages", isCorrect: false }
    ],
    tip: "Smart snacks with protein and complex fiber satisfy evening hunger without empty calories."
  }
];

export function getRandomQuiz(count = 3) {
  const shuffled = [...HEALTH_QUIZ_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
