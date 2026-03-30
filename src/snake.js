export const GRID_SIZE = 14;
export const INITIAL_DIRECTION = "right";

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function createInitialState(random = Math.random) {
  const snake = [
    { x: 4, y: 7 },
    { x: 3, y: 7 },
    { x: 2, y: 7 },
  ];

  return {
    snake,
    direction: INITIAL_DIRECTION,
    pendingDirection: INITIAL_DIRECTION,
    food: placeFood(snake, GRID_SIZE, random),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function setDirection(currentDirection, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return currentDirection;
  }

  if (OPPOSITE_DIRECTIONS[currentDirection] === nextDirection) {
    return currentDirection;
  }

  return nextDirection;
}

export function placeFood(snake, gridSize, random = Math.random) {
  const occupied = new Set(snake.map((segment) => toKey(segment)));
  const availableCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const cell = { x, y };
      if (!occupied.has(toKey(cell))) {
        availableCells.push(cell);
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  const index = Math.min(
    availableCells.length - 1,
    Math.floor(random() * availableCells.length),
  );

  return availableCells[index];
}

export function stepGame(state, random = Math.random) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = setDirection(state.direction, state.pendingDirection);
  const nextHead = getNextHead(state.snake[0], direction);
  const ateFood = positionsEqual(nextHead, state.food);
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);

  if (hitsBoundary(nextHead, GRID_SIZE) || hitsSnake(nextHead, collisionBody)) {
    return {
      ...state,
      direction,
      pendingDirection: direction,
      isGameOver: true,
    };
  }

  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  const food = ateFood ? placeFood(nextSnake, GRID_SIZE, random) : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction,
    food,
    score: ateFood ? state.score + 1 : state.score,
    isGameOver: food === null ? true : false,
  };
}

export function getNextHead(head, direction) {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: head.x + vector.x,
    y: head.y + vector.y,
  };
}

export function hitsBoundary(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

export function hitsSnake(head, snake) {
  return snake.some((segment) => positionsEqual(segment, head));
}

export function positionsEqual(a, b) {
  return Boolean(a && b) && a.x === b.x && a.y === b.y;
}

function toKey(position) {
  return `${position.x},${position.y}`;
}
