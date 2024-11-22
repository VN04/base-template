import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GRID_SIZE = 4;

const Tile = ({ value, position }) => {
  const [row, col] = position;
  const tileColor = value ? `bg-${Math.log2(value) * 100}` : 'bg-slate-200';
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center text-2xl font-bold ${tileColor}`}
    >
      {value || ''}
    </div>
  );
};

function generateNewNumber(grid) {
  const emptyCells = grid
    .flatMap((row, i) => row.map((cell, j) => (cell === null ? [i, j] : null)))
    .filter((cell) => cell !== null);

  if (emptyCells.length === 0) return grid;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map((row) => [...row]);
  newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function moveGrid(direction, grid) {
  let moved = false;
  let newGrid = grid.map((row) => row.filter(Boolean));

  const rotate = (times) => (array) => {
    for (let i = 0; i < times; i++) {
      array = array[0].map((_, index) =>
        array.map((row) => row[index]).reverse()
      );
    }
    return array;
  };

  switch (direction) {
    case 'left':
      break;
    case 'right':
      newGrid = rotate(2)(newGrid);
      break;
    case 'up':
      newGrid = rotate(3)(newGrid);
      break;
    case 'down':
      newGrid = rotate(1)(newGrid);
      break;
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 1; j < GRID_SIZE; j++) {
      if (newGrid[i][j]) {
        let k = j;
        while (k > 0 && !newGrid[i][k - 1]) {
          newGrid[i][k - 1] = newGrid[i][k];
          newGrid[i][k] = null;
          k--;
          moved = true;
        }
        if (k > 0 && newGrid[i][k - 1] === newGrid[i][k]) {
          newGrid[i][k - 1] *= 2;
          newGrid[i][k] = null;
          moved = true;
        }
      }
    }
  }

  if (direction === 'right' || direction === 'down')
    newGrid = rotate(4 - (direction === 'right' ? 2 : 1))(newGrid);

  return moved
    ? newGrid.map((row) => [
        ...row,
        ...Array(GRID_SIZE - row.length).fill(null),
      ])
    : grid;
}

export default function App() {
  const [grid, setGrid] = useState(() => {
    let initialGrid = Array(GRID_SIZE)
      .fill()
      .map(() => Array(GRID_SIZE).fill(null));
    initialGrid = generateNewNumber(initialGrid);
    return generateNewNumber(initialGrid);
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const direction = e.key.replace('Arrow', '').toLowerCase();
        const newGrid = moveGrid(direction, grid);
        if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
          const updatedGrid = generateNewNumber(newGrid);
          setGrid(updatedGrid);
          if (updatedGrid.flat().includes(2048)) setWon(true);
          if (updatedGrid.flat().every((cell) => cell !== null))
            setGameOver(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  const resetGame = () => {
    setGrid(() => {
      let newGrid = Array(GRID_SIZE)
        .fill()
        .map(() => Array(GRID_SIZE).fill(null));
      newGrid = generateNewNumber(newGrid);
      return generateNewNumber(newGrid);
    });
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>2048 Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <Tile key={`${i}-${j}`} value={cell} position={[i, j]} />
              ))
            )}
          </div>
        </CardContent>
        <Button onClick={resetGame} className="mt-4">
          New Game
        </Button>
      </Card>
      {gameOver && (
        <p className="text-red-500 font-bold">Game Over! You Lost.</p>
      )}
      {won && (
        <p className="text-green-500 font-bold">Congratulations! You've won!</p>
      )}
    </div>
  );
}
