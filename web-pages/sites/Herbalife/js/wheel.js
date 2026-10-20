// Wheel of Fortune with Precise Weighted Probability Engine
export const WHEEL_SEGMENTS = [
  {
    id: "afresh_drink",
    label: "Afresh Energy Drink",
    sublabel: "Saffron, Ginger, Lemon, Tulsi",
    probability: 85.0, // 85%
    color: "#2ECC71",
    textColor: "#FFFFFF",
    icon: "🍵",
    codePrefix: "HL-AFRESH",
    rewardTitle: "Free Afresh Energy Drink 🍵",
    rewardDesc: "Choose your favorite flavor: Saffron, Ginger, Lemon, or Tulsi at our stall bar!"
  },
  {
    id: "healthy_snack",
    label: "Healthy Snack Box",
    sublabel: "Poha Dumplings / Millet Balls",
    probability: 12.0, // 12%
    color: "#1E8449",
    textColor: "#FFFFFF",
    icon: "🥟",
    codePrefix: "HL-SNACK",
    rewardTitle: "Wholesome Snack Box 🥟",
    rewardDesc: "Claim freshly prepared steamed Poha Dumplings or Finger Millet (Ragi) Balls!"
  },
  {
    id: "surprise_gift",
    label: "Surprise Gift",
    sublabel: "Exclusive Stall Goodie",
    probability: 1.5, // 1.5%
    color: "#FFC72C",
    textColor: "#1F2A24",
    icon: "🎁",
    codePrefix: "HL-GIFT",
    rewardTitle: "Surprise Stall Gift 🎁",
    rewardDesc: "Claim your Herbalife shaker cup or exclusive wellness goodie bag!"
  },
  {
    id: "jackpot",
    label: "★ JACKPOT ★",
    sublabel: "Grand Wellness Hamper",
    probability: 0.5, // 0.5%
    color: "#FF8C00",
    textColor: "#FFFFFF",
    icon: "🏆",
    codePrefix: "HL-JACKPOT",
    rewardTitle: "🌟 MEGA JACKPOT HAMPER 🌟",
    rewardDesc: "Grand Prize Winner! Claim your Full Nutrition Starter Kit & VIP Coach Evaluation!"
  },
  {
    id: "try_quiz",
    label: "Try Health Quiz",
    sublabel: "Bonus Question Challenge",
    probability: 1.0, // 1.0%
    color: "#58D68D",
    textColor: "#1F2A24",
    icon: "🧠",
    codePrefix: "HL-CHALLENGE",
    rewardTitle: "Bonus Health Challenge 🧠",
    rewardDesc: "You unlocked the VIP Quiz challenge! Complete 3 quick questions to win guaranteed goodies!"
  }
];

/**
 * Calculates the winning segment based on exact weighted probability
 */
export function getWeightedWinningSegment() {
  const rand = Math.random() * 100; // 0.0 to 100.0
  let cumulative = 0;

  for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
    cumulative += WHEEL_SEGMENTS[i].probability;
    if (rand < cumulative) {
      return { index: i, segment: WHEEL_SEGMENTS[i] };
    }
  }
  return { index: 0, segment: WHEEL_SEGMENTS[0] };
}
