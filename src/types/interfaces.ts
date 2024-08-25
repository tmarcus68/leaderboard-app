export interface Team {
  id: number;
  rank: number;
  country: string;
  logo: string;
  chineseName: string;
  englishName: string;
  score: number;
  deductedScore: number;
}

export interface TeamCardProps {
  team: Team;
  onScoreChange: (id: number, newScore: number) => void;
  onDeductedScoreChange: (id: number, newDeductedScore: number) => void;
}
