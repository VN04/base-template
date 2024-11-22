import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GRID_SIZE = 4;
const WINNING_NUMBER = 2048;

//initialize the empty grid.
function getEmptyGrid() {
  return Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(0));
}

function getRandomEmptyCell(grid) {
  const emptyCells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function addNewTile(grid) {
  const [row, col] = getRandomEmptyCell(grid);
  const maxNumber = Math.max(...grid.flat()); //finding the max number tile in game
  const newValue = Math.random() < 0.9 ? 2 : Math.min(4, maxNumber);
  grid[row][col] = newValue;
  return grid;
}

function moveLeft(grid) {
  const newGrid = grid.map((row) => {
    const filteredRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];
    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        mergedRow.push(filteredRow[i] * 2);
        i++;
      } else {
        mergedRow.push(filteredRow[i]);
      }
    }
    return mergedRow.concat(Array(GRID_SIZE - mergedRow.length).fill(0));
  });
  return newGrid;
}

function rotateGrid(grid) {
  return grid[0].map((_, index) => grid.map((row) => row[index]).reverse());
}

function move(grid, direction) {
  let newGrid = [...grid];
  for (let i = 0; i < direction; i++) {
    newGrid = rotateGrid(newGrid);
  }
  newGrid = moveLeft(newGrid);
  for (let i = 0; i < (4 - direction) % 4; i++) {
    newGrid = rotateGrid(newGrid);
  }
  return newGrid;
}

function isGameOver(grid) {
  if (grid.flat().includes(0)) return false;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (
        (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) ||
        (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j])
      ) {
        return false;
      }
    }
  }
  return true;
}

function Tile({ value }) {
  const colorClass =
    value === 0 ? 'bg-gray-200' : `bg-orange-${Math.min(value, 800)}`;
  return (
    <div
      className={`w-16 h-16 ${colorClass} flex items-center justify-center rounded-md text-2xl font-bold`}
    >
      {value !== 0 && value}
    </div>
  );
}

export default function App() {
  const [grid, setGrid] = useState(() => {
    const newGrid = getEmptyGrid();
    addNewTile(newGrid);
    addNewTile(newGrid);
    return newGrid;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || gameWon) return;
      const directions = {
        ArrowLeft: 0,
        ArrowUp: 3,
        ArrowRight: 2,
        ArrowDown: 1,
      };
      if (e.key in directions) {
        const newGrid = move(grid, directions[e.key]);
        if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
          //add a new tile after each move
          addNewTile(newGrid);
          setGrid(newGrid);
          if (newGrid.flat().includes(WINNING_NUMBER)) {
            //check if 2048 is already in the tile
            setGameWon(true);
          } else if (isGameOver(newGrid)) {
            // check is game is over
            setGameOver(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, gameWon]);

  const resetGame = () => {
    const newGrid = getEmptyGrid();
    addNewTile(newGrid);
    addNewTile(newGrid);
    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">2048</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {grid.flat().map((value, index) => (
              <Tile key={index} value={value} />
            ))}
          </div>
          {gameOver && (
            <div className="text-center text-red-500 font-bold mb-4">
              Game Over! You lost.
            </div>
          )}
          {gameWon && (
            <div className="text-center text-green-500 font-bold mb-4">
              Congratulations! You won!
            </div>
          )}
          <div className="flex justify-center">
            <Button onClick={resetGame}>New Game</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
