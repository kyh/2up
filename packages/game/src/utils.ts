const scoreForCorrectAnswer = 100;
const maxBonusScore = 100;

export const maxScorePerScene = scoreForCorrectAnswer + maxBonusScore;

const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));

export const calculateScore = (
  isCorrect: boolean,
  startTime: number,
  endTime: number,
  duration: number,
) => {
  if (!isCorrect) return 0;

  const difference = Math.round((endTime - startTime) / 1000);
  if (difference > duration) return scoreForCorrectAnswer;

  const timeScore = (1 - invlerp(0, duration, difference)) * maxBonusScore;

  return Math.round(scoreForCorrectAnswer + timeScore);
};

export const compareAnswer = (answer: string, answerToCompare: string) => {
  return answer.trim().toLowerCase() === answerToCompare.trim().toLowerCase();
};
