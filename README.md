# 🐍 Classic Snake Game

A lightweight, fully responsive, and mobile-friendly Snake Game built from scratch using HTML5, CSS3, and Vanilla JavaScript. Built just for fun and practice!

Live Game Features:
*   **Mobile-Ready Swipe Controls:** Play seamlessly on touch screens by swiping in the direction you want the snake to move.
*   **Keyboard Support:** Control the snake using either the Arrow keys or standard `WASD` keys.
*   **Formatted Game Timer:** A running stopwatch tracking gameplay elapsed time formatted as `MM:SS`.
*   **High Score Persistence:** Automatically saves your highest score using the browser's `localStorage` so it persists between visits.
*   **State Modals:** Clean overlay interfaces for starting the game, pausing (`Spacebar` to toggle), and restarting after a Game Over.
*   **Clean Grid Alignment:** Features dynamic CSS Grid adjustments in JavaScript to prevent layout shifts or gaps on different screen sizes.

---

## 🎮 How to Play

### Controls

| Action | Keyboard Input | Mobile Input |
| :--- | :--- | :--- |
| **Move Up** | `ArrowUp` / `W` | Swipe Up |
| **Move Down** | `ArrowDown` / `S` | Swipe Down |
| **Move Left** | `ArrowLeft` / `A` | Swipe Left |
| **Move Right** | `ArrowRight` / `D` | Swipe Right |
| **Pause / Resume** | `Spacebar` / Click Resume | Tap Screen (Pause Menu) |

### Game Rules
1.  **Eat Food:** Direct the snake to eat the pink pulsing food blocks to grow and gain `+10` points.
2.  **Avoid Walls:** Do not let the snake head hit the boundaries of the board.
3.  **Avoid Yourself:** Do not let the snake head collide with any part of its body.

---

## 🛠️ Built With

*   **HTML5:** Simple game structure.
*   **CSS3:** Page layout, arcade styles, and keyframe animations.
*   **JavaScript (ES6+):** Game loop state, collision logic, input buffering, and event handling.

---

## 🚀 How to Run Locally

Since this is a client-side web application, you do not need any compilation or build steps to run it:

1. Clone or download this repository.
2. Open the directory containing the files.
3. Double-click [index.html](index.html) to open the game directly in any modern web browser.
