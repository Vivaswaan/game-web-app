const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const block_size = 20;
const Direction = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    UP: 'UP',
    DOWN: 'DOWN'
};

let snake, food, direction, score, gameInterval, gameInProgress = false;
let scoreDisplay = document.getElementById('score');

function startGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    food = { x: 5, y: 5 };
    direction = Direction.RIGHT;
    score = 0;
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(updateGame, 100); // Adjust the game speed as needed
    gameInProgress = true;
}

function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = 'lime'; // Set lime green for the head
        } else {
            ctx.fillStyle = 'green'; // Set green for the rest of the body
        }
        ctx.fillRect(segment.x * block_size, segment.y * block_size, block_size, block_size); // Draw a filled rectangle representing a snake segment
    });
    
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * block_size, food.y * block_size, block_size, block_size);
}

function moveSnake() {
    let x = snake[0].x;
    let y = snake[0].y;

    if (direction === Direction.RIGHT) x++;
    if (direction === Direction.LEFT) x--;
    if (direction === Direction.DOWN) y++;
    if (direction === Direction.UP) y--;

    snake.unshift({ x, y });

    if (x === food.x && y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / block_size));
        y = Math.floor(Math.random() * (canvas.height / block_size));
    } while (isFoodInsideSnake(x, y));

    food = { x, y };
}

function isFoodInsideSnake(x, y) {
    for (let i = 0; i < snake.length; i++) {
        if (x === snake[i].x && y === snake[i].y) {
            return true;
        }
    }
    return false;
}


function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / block_size || head.y < 0 || head.y >= canvas.height / block_size) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function updateGame() {
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Score: ' + score);
        gameInProgress = false;
        scoreDisplay.innerText = 'Score: ' + score;
        fetch('add-score',{
            method: 'POST',
            body: JSON.stringify({score:score}),
        }).then((_res)=>{
            window.location.href="/";
        });
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    scoreDisplay.innerText = 'Score: ' + score;
}

document.addEventListener('keydown', (event) => {
    if (!gameInProgress) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== Direction.DOWN) direction = Direction.UP;
            break;
        case 'ArrowDown':
            if (direction !== Direction.UP) direction = Direction.DOWN;
            break;
        case 'ArrowLeft':
            if (direction !== Direction.RIGHT) direction = Direction.LEFT;
            break;
        case 'ArrowRight':
            if (direction !== Direction.LEFT) direction = Direction.RIGHT;
            break;
    }
});

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', () => {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
});

document.getElementById('stopButton').addEventListener('click', () => {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    snake = [];
    food = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameInProgress = false;
    scoreDisplay.innerText = 'Score: ' + score;
    fetch('add-score',{
        method: 'POST',
        body: JSON.stringify({score:score}),
    }).then((_res)=>{
        window.location.href="/";
    });
});

