# Snake, But Respectfully Classic

A tiny browser Snake game built to do one job well: slither, snack, grow, and eventually bonk into a wall because confidence got ahead of coordination.

This project keeps things intentionally simple:
- Classic grid-based Snake gameplay
- Keyboard controls plus on-screen controls for smaller screens
- Deterministic game logic separated from rendering
- No extra dependencies
- Lightweight GitHub Pages deployment

## What You Get

- A clean arcade-style board
- A snake with a proper-looking head
- Food spawning and score tracking
- Pause and restart
- Game-over and win states
- Tests for the core gameplay rules

## Run It Locally

You only need Node installed.

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:3000
```

## Controls

- `Arrow keys` or `WASD`: move
- `Space`: pause / resume
- `Restart` button: start over with dignity

On small screens, use the on-screen directional controls.

## Run Tests

```bash
npm test
```

The tests cover the game logic, including:
- normal movement
- growth after eating food
- wall collision
- self collision
- blocked reverse turns
- safe movement into the cell a tail just vacated
- pause and game-over stability
- food placement rules
- win condition when the board is filled

## Project Structure

```text
.
├── index.html                # App shell
├── styles.css                # Minimal UI styling
├── server.js                 # Tiny local dev server
├── src/
│   ├── app.js                # Rendering, controls, game loop
│   └── snake.js              # Core deterministic game logic
├── test/
│   └── snake.test.js         # Logic tests
└── .github/workflows/
    └── deploy-pages.yml      # GitHub Pages deployment
```

## Manual Checklist

Before you ship it into the wild, give it a quick human test:

- The snake head is visually different from the body
- Keyboard controls respond correctly
- On-screen controls work on mobile-sized layouts
- The snake grows after eating food
- Score increases correctly
- Pause works and does not advance the game
- Restart resets the score and board
- Hitting a wall ends the game
- Hitting the body ends the game
- Filling the final open cell triggers a win

## Deploy to GitHub Pages

This repo already includes a GitHub Actions workflow for Pages deployment.

### 1. Push the repo to GitHub

```bash
git add .
git commit -m "Build classic Snake game"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Turn on GitHub Pages

In your GitHub repo:

1. Open `Settings`
2. Open `Pages`
3. Under deployment source, choose `GitHub Actions`

After that, every push to `main` will redeploy the site.

## Why It’s Built This Way

The game rules live in `src/snake.js`, separate from the DOM code in `src/app.js`. That makes the logic easier to test and easier to trust, which is especially nice for small games where bugs love hiding in movement and collision rules.

## Final Wisdom

If you lose, blame the corners.

If you win, absolutely take full credit.
