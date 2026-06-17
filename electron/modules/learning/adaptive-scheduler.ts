export class AdaptiveScheduler {
  /**
   * Spaced repetition algorithm (SuperMemo-2 variant)
   */
  public static calculateNextReview(quality: number, previousInterval: number, easeFactor: number): { interval: number, newEase: number } {
    let newEase = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEase < 1.3) newEase = 1.3;

    let interval = 1;
    if (quality >= 3) {
      if (previousInterval === 0) interval = 1;
      else if (previousInterval === 1) interval = 6;
      else interval = Math.round(previousInterval * newEase);
    } else {
      interval = 1; // reset if forgot
    }

    return { interval, newEase };
  }
}
