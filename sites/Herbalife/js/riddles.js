// Tamil Cinema Fun Riddles Question Pool (12 Fun Health & Movie Riddles)
export const TAMIL_RIDDLES_POOL = [
  {
    id: 1,
    dialogue: "🎬 'Naan oru thadava sonna, nooru thadava sonna madhiri!' — Superstar Rajinikanth (Baasha)",
    question: "Just like Baasha's golden word, which daily health discipline gives 100x benefits when done consistently?",
    options: [
      { text: "Skipping breakfast and rushing to work", isCorrect: false },
      { text: "Starting every morning with a nutritious, balanced shake", isCorrect: true },
      { text: "Drinking only 1 cup of water all day", isCorrect: false },
      { text: "Late night binge eating with zero sleep", isCorrect: false }
    ],
    explanation: "Consistency is king! A healthy breakfast shake fuels your entire day with 21 essential vitamins."
  },
  {
    id: 2,
    dialogue: "🎬 'Building-ae strong-u, aana base-matam weak-u!' — Vadivelu Comedy",
    question: "Vadivelu warns about a weak base! What is the true 'foundation block' our body needs every single day for strong muscles & cells?",
    options: [
      { text: "Pure Sugar & Sweets", isCorrect: false },
      { text: "High-Quality Clean Protein", isCorrect: true },
      { text: "Fried oily snacks", isCorrect: false },
      { text: "Only caffeine shots", isCorrect: false }
    ],
    explanation: "Protein is the building block of every cell, muscle, and tissue in our body!"
  },
  {
    id: 3,
    dialogue: "🎬 'Vaaranam Aayiram' Six-Pack Transformation — Suriya",
    question: "Suriya inspired millions across Tamil Nadu to hit the gym. What is essential right after a good workout for muscle recovery?",
    options: [
      { text: "Cold carbonated sodas", isCorrect: false },
      { text: "Quality protein shake with BCAAs & hydration", isCorrect: true },
      { text: "Heavy oil-drenched parotta", isCorrect: false },
      { text: "Sleeping immediately without water", isCorrect: false }
    ],
    explanation: "Post-workout protein and hydration repair muscle fibers and build lean strength."
  },
  {
    id: 4,
    dialogue: "🎬 'Never, ever give up!' — Thala Ajith Kumar (Vivegam / Mankatha)",
    question: "When starting a 30-day health & weight management journey, what mindset ensures success?",
    options: [
      { text: "Giving up on day 2 if scales don't drop", isCorrect: false },
      { text: "Crash starvation diets", isCorrect: false },
      { text: "Consistency, hydration, and positive daily nutrition", isCorrect: true },
      { text: "Eating heavy junk on weekdays", isCorrect: false }
    ],
    explanation: "Stay unstoppable! Daily small healthy habits lead to life-changing transformations."
  },
  {
    id: 5,
    dialogue: "🎬 'Vathi Coming Ottha Sollaala!' — Thalapathy Vijay (Master / Ghilli)",
    question: "Vijay brings explosive dance energy to every song. What natural energy booster gives jitter-free mental alertness?",
    options: [
      { text: "Afresh Energy Drink with Natural Green Tea extracts", isCorrect: true },
      { text: "Extra sugary syrup drinks", isCorrect: false },
      { text: "Sleeping 14 hours during day", isCorrect: false },
      { text: "Excessive deep fried pakoras", isCorrect: false }
    ],
    explanation: "Herbalife Afresh contains natural guarana & tea extracts that rev up metabolism cleanly."
  },
  {
    id: 6,
    dialogue: "🎬 'Anniyan' — 'Ainthu Nodi Thannir Kudika Maranthal...' (Rules of Life)",
    question: "In Anniyan, discipline was everything! How much water should an active adult drink daily for glowing vitality?",
    options: [
      { text: "Only 1 glass when thirsty", isCorrect: false },
      { text: "At least 8 to 10 glasses (2.5 to 3.5 Litres)", isCorrect: true },
      { text: "Zero water, only aerated drinks", isCorrect: false },
      { text: "12 Litres at one single sitting", isCorrect: false }
    ],
    explanation: "Drinking 8-10 glasses across the day optimizes digestion, skin glow, and organ function."
  },
  {
    id: 7,
    dialogue: "🎬 'En vazhi, thani vazhi!' — Superstar Rajinikanth (Padayappa)",
    question: "What is the unique Herbalife way to maintain ideal weight without feeling starved or exhausted?",
    options: [
      { text: "Nutrient-dense meal replacement with calibrated calories", isCorrect: true },
      { text: "Skipping all meals completely", isCorrect: false },
      { text: "Eating only cucumber for 30 days", isCorrect: false },
      { text: "Drinking zero water", isCorrect: false }
    ],
    explanation: "Formula 1 Shake delivers full nutrition, vitamins, and protein with controlled calories."
  },
  {
    id: 8,
    dialogue: "🎬 'Singam' — 'Oru thadava mudivu pannita, en pecha naane kekka maaten!'",
    question: "Once you decide to lead an active lifestyle, what traditional Indian snack option gives rich fiber & minerals?",
    options: [
      { text: "Finger Millet (Ragi) & Steamed Poha Dumplings", isCorrect: true },
      { text: "Cream cakes with artificial icing", isCorrect: false },
      { text: "Potato chips with extra salt", isCorrect: false },
      { text: "Refined maida bakery puffs", isCorrect: false }
    ],
    explanation: "Millets and steamed poha are packed with complex carbs, iron, and slow-release energy."
  },
  {
    id: 9,
    dialogue: "🎬 'Sivaji The Boss' — 'Singam single-ah thaan varum!'",
    question: "What is the single best ingredient for soothing digestion, cooling the gut, and enhancing nutrient absorption?",
    options: [
      { text: "Concentrated Aloe Vera Extract", isCorrect: true },
      { text: "Red chili paste", isCorrect: false },
      { text: "Boiling hot oil", isCorrect: false },
      { text: "Artificial sour candy", isCorrect: false }
    ],
    explanation: "Herbal Aloe Concentrate soothes the intestinal tract and promotes healthy hydration."
  },
  {
    id: 10,
    dialogue: "🎬 'Vikram' — 'Aarambikalangala!' — Kamal Haasan",
    question: "When starting your day at the stall or at home, what gives you an instant 2-minute nutritional kickstart?",
    options: [
      { text: "Formula 1 Shake blended with your favorite fruit & protein", isCorrect: true },
      { text: "Waking up at 1 PM with a headache", isCorrect: false },
      { text: "3 oily samosas with extra chili", isCorrect: false },
      { text: "Zero breakfast and 4 sugary coffees", isCorrect: false }
    ],
    explanation: "Formula 1 is ready in 90 seconds, providing complete nutrition for fast-paced modern life!"
  }
];

export function getRandomRiddles(count = 3) {
  const shuffled = [...TAMIL_RIDDLES_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
