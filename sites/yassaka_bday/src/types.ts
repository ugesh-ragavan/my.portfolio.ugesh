export type FlowerType = 'rose' | 'sunflower' | 'tulip' | 'jasmine' | 'all';

export interface QuizState {
  flower: FlowerType;
  escapeWish: string;
  soulPrescription: string;
  birthdayVibe: string;
  happinessLevel: number; // 1 to 5
}

export interface AppState {
  currentStep: number; // 1 to 7
  highestUnlockedStep: number;
  unlockedChamber: boolean;
  quizCompleted: boolean;
  quizAnswers: QuizState;
  candleLit: boolean;
  candleBlown: boolean;
  customWish: string;
}

export const INITIAL_QUIZ: QuizState = {
  flower: 'jasmine',
  escapeWish: 'All of the above, obviously! 👑',
  soulPrescription: "You are doing 1000x better than you think.",
  birthdayVibe: 'Full-on celebration & cake smash 🎂',
  happinessLevel: 5
};

export const INITIAL_STATE: AppState = {
  currentStep: 1,
  highestUnlockedStep: 1,
  unlockedChamber: false,
  quizCompleted: false,
  quizAnswers: INITIAL_QUIZ,
  candleLit: true,
  candleBlown: false,
  customWish: ''
};
