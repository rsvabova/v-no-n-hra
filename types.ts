export type GameState = 
  | 'intro' 
  | 'story_1' | 'level_1_gate' 
  | 'story_2' | 'level_2_mult' 
  | 'story_3' | 'level_3_add' 
  | 'story_4' | 'level_4_units' 
  | 'victory';

export interface Position {
  top: number;
  left: number;
}

export interface StarData {
  id: string;
  value: number;
  position: Position;
  delay: number;
}

export interface Problem {
  result: number;
  display: string; // How the problem is shown to the user (e.g. "5 x 5" or "1 m = ? cm")
}

export type ProblemType = 'MULT_DIV' | 'ADD_SUB' | 'UNITS';