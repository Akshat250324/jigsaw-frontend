// src/utils/puzzleUtils.js

export function createPuzzle(size) {
  const total = size * size;

  const pieces = Array.from({ length: total }, (_, i) => ({
    id: i,
    correctIndex: i,
  }));

  // shuffle
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  return pieces;
}

export function isSolved(pieces) {
  return pieces.every((p, i) => p.correctIndex === i);
}
