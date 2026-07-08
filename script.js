const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');
const resumeButton = document.querySelector('.btn-resume');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const gamePausedModal = document.querySelector(".game-paused")

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highScore;

let cols = 0;
let rows = 0;
let intervalId = null;
let timerIntervalId = null;

const blocks = [];
let snake = [{ x: 1, y: 3 }];

let food;

let direction = 'right';
let lastDirection = 'right'; //Tracks direction rendered in the last frame

function initGame() {
    cols = Math.floor(board.clientWidth / blockWidth);
    rows = Math.floor(board.clientHeight / blockHeight);

    // If the iframe dimensions are not computed yet, retry in 50ms
    if (cols <= 0 || rows <= 0) {
        setTimeout(initGame, 50);
        return;
    }

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    board.innerHTML = ''; // Clear board of any existing children
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement('div');
            block.classList.add("block");
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }

    spawnFood(); // Spawn food now that dimensions are ready
}

initGame();

function spawnFood() {
    let newFood;
    let onSnake = true;
    while (onSnake) {
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
        //Check if the generated food overlaps with any segment of the snake
        onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    }
    food = newFood;
}

function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }

    //Check if head hits snake's own body
    const selfCollision = snake.some((segment) => segment.x === head.x && segment.y === head.y);
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols || selfCollision) {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        spawnFood();
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    } else {
        snake.unshift(head);
        snake.pop();
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })

    lastDirection = direction;
}

startButton.addEventListener("click", () => {
    if (cols <= 0 || rows <= 0) return;
    modal.style.display = "none";
    intervalId = setInterval(() => {
        render();
    }, 300);
    startTimer();
})

restartButton.addEventListener("click", restartGame);

resumeButton.addEventListener("click", resumeGame);

function startTimer() {
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split(":").map(Number);

        if (sec == 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }
        const paddedMin = String(min).padStart(2, '0');
        const paddedSec = String(sec).padStart(2, '0');
        time = `${paddedMin}:${paddedSec}`;
        timeElement.innerText = time;
    }, 1000);
}


function restartGame() {
    // Clear any active game loop and timer loop first to prevent multiple intervals running
    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    score = 0;
    time = `00:00`;

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;
    modal.style.display = "none";
    direction = "down";
    lastDirection = "down";
    snake = [{ x: 1, y: 3 }];
    spawnFood();
    intervalId = setInterval(() => {
        render();
    }, 300);
    startTimer();
}

function pauseGame() {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    // Set active intervals to null so we know the game is currently stopped
    intervalId = null;
    timerIntervalId = null;

    // Display your modals
    modal.style.display = "flex";
    gamePausedModal.style.display = "flex";
    gameOverModal.style.display = "none";
    startGameModal.style.display = "none";
}

function resumeGame() {
    modal.style.display = "none";
    gamePausedModal.style.display = "none";

    // Restart the loops if they aren't already running
    if (!intervalId) {
        intervalId = setInterval(() => {
            render();
        }, 300);
    }

    if (!timerIntervalId) {
        startTimer();
    }
}

window.addEventListener("keydown", (e) => {
    // Check for space bar to toggle pause/resume
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault(); // Prevents the browser page from scrolling down
        if (modal.style.display === "flex") {
            // Only resume if it was the pause menu open, not game over
            if (gamePausedModal.style.display === "flex") {
                resumeGame();
            }
        } else {
            pauseGame();
        }
        return; // Stop execution here so it doesn't process movement keys
    }

    // Snake movement controls (only allow inputs if game is not paused)
    if (modal.style.display !== "flex") {
        if ((e.key === "ArrowUp" || e.key.toLowerCase() === "w") && lastDirection !== "down") {
            direction = "up";
        } else if ((e.key === "ArrowDown" || e.key.toLowerCase() === "s") && lastDirection !== "up") {
            direction = "down";
        } else if ((e.key === "ArrowRight" || e.key.toLowerCase() === "d") && lastDirection !== "left") {
            direction = "right";
        }
        else if ((e.key === "ArrowLeft" || e.key.toLowerCase() === "a") && lastDirection !== "right") {
            direction = "left";
        }
    }
});

// --- MOBILE SWIPE CONTROLS ---
let touchStartX = 0;
let touchStartY = 0;

// Record where the touch started
window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

// Record where the touch ended and calculate the direction of the swipe
window.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;

    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, { passive: true });

function handleSwipe(startX, startY, endX, endY) {
    // Only allow swipe inputs if the game is active (no modals open)
    if (modal.style.display === "flex") return;

    const diffX = endX - startX;
    const diffY = endY - startY;

    // Ignore tiny taps or accidental slight movements (threshold is 30 pixels)
    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (diffX > 0 && lastDirection !== "left") {
            direction = "right";
        } else if (diffX < 0 && lastDirection !== "right") {
            direction = "left";
        }
    } else {
        // Vertical Swipe
        if (diffY > 0 && lastDirection !== "up") {
            direction = "down";
        } else if (diffY < 0 && lastDirection !== "down") {
            direction = "up";
        }
    }
}
