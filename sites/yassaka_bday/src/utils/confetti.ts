import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Center blast
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#F43F5E', '#FBBF24']
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#F472B6', '#FBBF24', '#38BDF8']
    });
  }, 180);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#A78BFA', '#34D399', '#FB7185']
    });
  }, 320);
}

export function fireGrandFinaleConfetti() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Left & Right showers
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#EC4899', '#F59E0B', '#10B981', '#6366F1', '#F43F5E']
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#EC4899', '#F59E0B', '#10B981', '#6366F1', '#F43F5E']
    });
  }, 250);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
