/**
 * Score type definitions
 */

export interface ScoreLevel {
  level: number;
  name: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  minScore: number;
  maxScore: number | null;
}
