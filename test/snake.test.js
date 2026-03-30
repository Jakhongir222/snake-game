import test from "node:test";
import assert from "node:assert/strict";

import {
  GRID_SIZE,
  createInitialState,
  placeFood,
  setDirection,
  stepGame,
} from "../src/snake.js";

test("snake moves one cell in the current direction", () => {
  const initial = createInitialState(() => 0);
  const next = stepGame(initial, () => 0);

  assert.deepEqual(next.snake[0], { x: 5, y: 7 });
  assert.equal(next.snake.length, initial.snake.length);
  assert.equal(next.score, 0);
});

test("snake grows and score increases after eating food", () => {
  const initial = {
    ...createInitialState(() => 0),
    food: { x: 5, y: 7 },
  };

  const next = stepGame(initial, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, initial.snake.length + 1);
  assert.deepEqual(next.snake[0], { x: 5, y: 7 });
});

test("reversing direction is ignored", () => {
  assert.equal(setDirection("right", "left"), "right");
  assert.equal(setDirection("up", "down"), "up");
});

test("collision with a wall ends the game", () => {
  const initial = {
    ...createInitialState(() => 0),
    snake: [{ x: GRID_SIZE - 1, y: 4 }],
    direction: "right",
    pendingDirection: "right",
  };

  const next = stepGame(initial, () => 0);
  assert.equal(next.isGameOver, true);
});

test("collision with the snake body ends the game", () => {
  const initial = {
    ...createInitialState(() => 0),
    snake: [
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ],
    direction: "up",
    pendingDirection: "left",
  };

  const next = stepGame(initial, () => 0);
  assert.equal(next.isGameOver, true);
});

test("food placement skips occupied cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const food = placeFood(snake, 3, () => 0);
  assert.deepEqual(food, { x: 0, y: 1 });
});

test("moving into the previous tail cell is allowed when not growing", () => {
  const initial = {
    ...createInitialState(() => 0),
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 2 },
    ],
    direction: "up",
    pendingDirection: "left",
    food: { x: 10, y: 10 },
  };

  const next = stepGame(initial, () => 0);

  assert.equal(next.isGameOver, false);
  assert.deepEqual(next.snake, [
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 1, y: 3 },
  ]);
});

test("paused games do not advance", () => {
  const initial = {
    ...createInitialState(() => 0),
    isPaused: true,
  };

  const next = stepGame(initial, () => 0);
  assert.equal(next, initial);
});

test("game over states do not advance", () => {
  const initial = {
    ...createInitialState(() => 0),
    isGameOver: true,
  };

  const next = stepGame(initial, () => 0);
  assert.equal(next, initial);
});

test("invalid directions are ignored", () => {
  assert.equal(setDirection("right", "nope"), "right");
});

test("full boards cannot place new food", () => {
  const snake = [];

  for (let y = 0; y < 2; y += 1) {
    for (let x = 0; x < 2; x += 1) {
      snake.push({ x, y });
    }
  }

  assert.equal(placeFood(snake, 2, () => 0), null);
});

test("eating the last available food wins the game", () => {
  const snake = [{ x: 1, y: 0 }];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if ((x === 0 && y === 0) || (x === 1 && y === 0)) {
        continue;
      }

      snake.push({ x, y });
    }
  }

  const initial = {
    ...createInitialState(() => 0),
    snake,
    direction: "left",
    pendingDirection: "left",
    food: { x: 0, y: 0 },
  };

  const next = stepGame(initial, () => 0);

  assert.equal(next.isGameOver, true);
  assert.equal(next.food, null);
  assert.equal(next.score, 1);
});
