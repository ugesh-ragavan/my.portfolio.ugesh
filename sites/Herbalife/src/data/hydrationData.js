export const ACTIVITY_LEVELS = [
  {
    id: 'light',
    label: 'Sedentary / Light',
    description: 'Desk work, casual walking (< 30 min/day)',
    waterMultiplier: 35, // ml per kg
    proteinMultiplier: 1.0, // g per kg
    icon: '🚶'
  },
  {
    id: 'moderate',
    label: 'Moderately Active',
    description: 'Brisk walk, yoga, 3-4 workouts/week',
    waterMultiplier: 40,
    proteinMultiplier: 1.3,
    icon: '🏃'
  },
  {
    id: 'high',
    label: 'Very Active / Athlete',
    description: 'Intense training, gym daily, sports',
    waterMultiplier: 45,
    proteinMultiplier: 1.6,
    icon: '🔥'
  }
];

export const calculateHydrationProfile = (weightKg, activityLevelId) => {
  const level = ACTIVITY_LEVELS.find(l => l.id === activityLevelId) || ACTIVITY_LEVELS[1];
  const waterMl = Math.round(weightKg * level.waterMultiplier);
  const waterLitres = (waterMl / 1000).toFixed(1);
  const glasses = Math.round(waterMl / 250);
  const proteinGrams = Math.round(weightKg * level.proteinMultiplier);

  let stack = [];
  if (level.id === 'high') {
    stack = [
      { name: 'Herbalife H24 Hydrate', role: 'Rapid bioavailable electrolyte replenishment during sweat & workouts' },
      { name: 'Herbal Aloe Concentrate', role: 'Digestive hydration & nutrient absorption booster' },
      { name: 'Herbal Tea Concentrate (Afresh)', role: 'Natural antioxidant & metabolic thermogenesis' }
    ];
  } else if (level.id === 'moderate') {
    stack = [
      { name: 'Herbal Aloe Concentrate (Mango/Mandarin)', role: 'Adds refreshing natural taste to make 3L daily easy' },
      { name: 'Afresh Energy Drink Mix (Lemon)', role: 'Guarana & orange pekoe extract for steady afternoon alertness' }
    ];
  } else {
    stack = [
      { name: 'Herbal Aloe Concentrate Original', role: 'Calming digestive comfort & enhanced cell hydration' },
      { name: 'Afresh Ginger / Tulsi Tea', role: 'Soothing antioxidant refreshment for desk hours' }
    ];
  }

  return {
    waterMl,
    waterLitres,
    glasses,
    proteinGrams,
    stack
  };
};
