import { Problem, StarData, Position, ProblemType } from '../types';

// Generate a random integer between min and max (inclusive)
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate positions based on the level type
const generatePositions = (count: number, type: ProblemType): Position[] => {
  const positions: Position[] = [];

  // GRID LOGIC (Distributed sky for ALL items - Stars, Fuel, and Gifts)
  // We removed the specific pile logic for UNITS as requested, so gifts cover the whole area.
  const rows = 3;
  const cols = 4;
  
  const cellWidth = 90 / cols; 
  const cellHeight = 70 / rows; 
  const offsetX = 5; 
  const offsetY = 15; 

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    // Random position within the cell
    const top = offsetY + (row * cellHeight) + randomInt(0, cellHeight - 15);
    const left = offsetX + (col * cellWidth) + randomInt(0, cellWidth - 10);

    positions.push({ top, left });
  }

  // Shuffle positions so the answers aren't in grid order
  return positions.sort(() => Math.random() - 0.5);
};

const generateUnitProblem = (): Problem => {
  // 4th grade unit conversions (simple integers)
  const types = [
    { from: 'm', to: 'cm', factor: 100 },
    { from: 'cm', to: 'mm', factor: 10 },
    { from: 'km', to: 'm', factor: 1000 },
    { from: 'kg', to: 'g', factor: 1000 },
    { from: 't', to: 'kg', factor: 1000 },
    // dm is sometimes used, keeping it simple
    { from: 'dm', to: 'cm', factor: 10 }, 
  ];

  const type = types[randomInt(0, types.length - 1)];
  const value = randomInt(1, 9);
  
  return {
    display: `${value} ${type.from} = ? ${type.to}`,
    result: value * type.factor
  };
};

const generateAddSubProblem = (): Problem => {
  const isAddition = Math.random() > 0.5;
  
  if (isAddition) {
    const a = randomInt(20, 400);
    const b = randomInt(20, 400);
    return {
      display: `${a} + ${b} = ?`,
      result: a + b
    };
  } else {
    // Subtraction: Result = A - B
    // We generate Result and Subtractor to ensure A is within bounds
    const result = randomInt(20, 500);
    const subtractor = randomInt(10, 300);
    const start = result + subtractor; // This is the number we subtract from
    
    return {
      display: `${start} - ${subtractor} = ?`,
      result: result
    };
  }
};

const generateMultDivProblem = (): Problem => {
  const isMult = Math.random() > 0.5; 
  const a = randomInt(2, 9);
  const b = randomInt(2, 9);
  const product = a * b;

  if (isMult) {
    return {
      display: `${a} · ${b} = ?`,
      result: product
    };
  } else {
    // Division: Product / A = B
    return {
      display: `${product} : ${a} = ?`,
      result: b
    };
  }
};

export const generateGameData = (count: number, type: ProblemType): { problems: Problem[], stars: StarData[] } => {
  const problems: Problem[] = [];
  const usedResults = new Set<number>();
  
  let attempts = 0;
  // Safety break after 2000 attempts
  while (problems.length < count && attempts < 2000) {
    attempts++;
    let problem: Problem;

    if (type === 'UNITS') {
      problem = generateUnitProblem();
    } else if (type === 'ADD_SUB') {
      problem = generateAddSubProblem();
    } else {
      problem = generateMultDivProblem();
    }
    
    // Only add if we haven't seen this result yet (to avoid ambiguous stars)
    if (!usedResults.has(problem.result)) {
      usedResults.add(problem.result);
      problems.push(problem);
    }
  }

  // Pass the 'type' to position generator to handle the 'pile' vs 'grid' logic
  const positions = generatePositions(problems.length, type);
  
  const stars: StarData[] = problems.map((problem, index) => ({
    id: `item-${problem.result}-${index}`,
    value: problem.result,
    position: positions[index], 
    delay: Math.random() * 2
  }));

  const shuffledProblems = [...problems].sort(() => Math.random() - 0.5);

  return {
    problems: shuffledProblems,
    stars
  };
};