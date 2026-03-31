import { GRID_SIZE, createInitialState, setDirection, stepGame } from "./snake.js";

const board = document.querySelector("#board");
const scoreValue = document.querySelector("#score");
const statusValue = document.querySelector("#status");
const restartButton = document.querySelector("#restart-button");
const mobileControls = document.querySelector(".mobile-controls");

const TICK_MS = 220;
const MIN_SWIPE_DISTANCE = 24;
const cells = [];

let gameState = createInitialState();
let timerId = null;
let touchStart = null;

buildBoard();
render();
startLoop();

window.addEventListener("keydown", (event) => {
  const action = mapKeyToAction(event.key);
  if (!action) {
    return;
  }

  event.preventDefault();

  if (action === "pause") {
    togglePause();
    return;
  }

  if (gameState.isGameOver) {
    return;
  }

  gameState = {
    ...gameState,
    pendingDirection: setDirection(gameState.direction, action),
  };
});

restartButton.addEventListener("click", resetGame);

mobileControls?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const direction = button.dataset.direction;
  const action = button.dataset.action;

  if (action === "pause") {
    togglePause();
    return;
  }

  if (!direction || gameState.isGameOver) {
    return;
  }

  gameState = {
    ...gameState,
    pendingDirection: setDirection(gameState.direction, direction),
  };
});

board.addEventListener("touchstart", handleTouchStart, { passive: true });
board.addEventListener("touchend", handleTouchEnd, { passive: true });

function startLoop() {
  stopLoop();
  timerId = window.setInterval(() => {
    gameState = stepGame(gameState);
    render();
  }, TICK_MS);
}

function stopLoop() {
  if (timerId !== null) {
    window.clearInterval(timerId);
  }
}

function resetGame() {
  gameState = createInitialState();
  render();
}

function togglePause() {
  if (gameState.isGameOver) {
    return;
  }

  gameState = {
    ...gameState,
    isPaused: !gameState.isPaused,
  };
  render();
}

function buildBoard() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    cells.push(cell);
    fragment.appendChild(cell);
  }

  board.appendChild(fragment);
}

function render() {
  const snakeMap = new Map(
    gameState.snake.map((segment, index) => [`${segment.x},${segment.y}`, index]),
  );
  const foodKey = gameState.food ? `${gameState.food.x},${gameState.food.y}` : null;

  cells.forEach((cell, index) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    const key = `${x},${y}`;
    const segmentIndex = snakeMap.get(key);

    cell.className = "cell";

    if (key === foodKey) {
      cell.classList.add("food");
    }

    if (segmentIndex !== undefined) {
      cell.classList.add("snake");
      if (segmentIndex === 0) {
        cell.classList.add("snake-head");
      }
    }
  });

  scoreValue.textContent = String(gameState.score);
  statusValue.textContent = getStatusText();
}

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  if (!touch) {
    return;
  }

  touchStart = {
    x: touch.clientX,
    y: touch.clientY,
  };
}

function handleTouchEnd(event) {
  if (!touchStart || gameState.isGameOver) {
    touchStart = null;
    return;
  }

  const touch = event.changedTouches[0];
  if (!touch) {
    touchStart = null;
    return;
  }

  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) {
    touchStart = null;
    return;
  }

  const direction = absX > absY
    ? deltaX > 0 ? "right" : "left"
    : deltaY > 0 ? "down" : "up";

  gameState = {
    ...gameState,
    pendingDirection: setDirection(gameState.direction, direction),
  };

  touchStart = null;
}

function getStatusText() {
  if (gameState.isGameOver && gameState.food === null) {
    return "You win";
  }

  if (gameState.isGameOver) {
    return "Game over";
  }

  if (gameState.isPaused) {
    return "Paused";
  }

  return "Running";
}

function mapKeyToAction(key) {
  const normalizedKey = key.toLowerCase();

  switch (normalizedKey) {
    case "arrowup":
    case "w":
      return "up";
    case "arrowdown":
    case "s":
      return "down";
    case "arrowleft":
    case "a":
      return "left";
    case "arrowright":
    case "d":
      return "right";
    case " ":
    case "spacebar":
      return "pause";
    default:
      return null;
  }
}
