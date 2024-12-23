const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = -2;
let yDirection = 2;
let timerId;
let score = 0;
let lives = 3;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPositions = [ballStart]; // Allow for multiple balls

// Sounds
const brickSound = new Audio('brick-hit.mp3');
const paddleSound = new Audio('paddle-hit.mp3');
const powerUpSound = new Audio('power-up.mp3');
const gameOverSound = new Audio('game-over.mp3');

// Create Block class
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

// Generate power-ups
class PowerUp {
  constructor(xAxis, yAxis) {
    this.position = [xAxis, yAxis];
    this.active = true;
  }

  create() {
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up');
    powerUp.style.left = this.position[0] + 'px';
    powerUp.style.bottom = this.position[1] + 'px';
    grid.appendChild(powerUp);
  }
}

// Create blocks
const blocks = [];
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 5; col++) {
    blocks.push(new Block(10 + col * (blockWidth + 10), 270 - row * (blockHeight + 10)));
  }
}

// Draw blocks
function drawBlocks() {
  blocks.forEach((block, index) => {
    const blockDiv = document.createElement('div');
    blockDiv.classList.add('block');
    blockDiv.style.left = block.bottomLeft[0] + 'px';
    blockDiv.style.bottom = block.bottomLeft[1] + 'px';
    blockDiv.dataset.index = index;
    grid.appendChild(blockDiv);
  });
}

drawBlocks();

// Add user paddle
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

// Move user paddle
function moveUser(e) {
  if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
    currentPosition[0] -= 10;
  } else if (e.key === 'ArrowRight' && currentPosition[0] < boardWidth - blockWidth) {
    currentPosition[0] += 10;
  }
  drawUser();
}
document.addEventListener('keydown', moveUser);

// Add ball(s)
ballCurrentPositions.forEach((pos, index) => addBall(pos, index));

function addBall(position, index) {
  const ball = document.createElement('div');
  ball.classList.add('ball');
  ball.dataset.index = index;
  ball.style.left = position[0] + 'px';
  ball.style.bottom = position[1] + 'px';
  grid.appendChild(ball);
}

// Move ball(s)
function moveBalls() {
  ballCurrentPositions.forEach((ballPos, index) => {
    ballPos[0] += xDirection;
    ballPos[1] += yDirection;

    const ball = document.querySelector(`.ball[data-index="${index}"]`);
    ball.style.left = ballPos[0] + 'px';
    ball.style.bottom = ballPos[1] + 'px';

    checkCollisions(ballPos, ball);
  });
}

timerId = setInterval(moveBalls, 30);

// Check collisions
function checkCollisions(ballPos, ball) {
  // Ball-wall collisions
  if (ballPos[0] <= 0 || ballPos[0] >= boardWidth - ballDiameter) xDirection *= -1;
  if (ballPos[1] >= boardHeight - ballDiameter) yDirection *= -1;

  // Ball-paddle collisions
  if (
    ballPos[0] >= currentPosition[0] &&
    ballPos[0] <= currentPosition[0] + blockWidth &&
    ballPos[1] <= currentPosition[1] + blockHeight
  ) {
    paddleSound.play();
    yDirection *= -1;
  }

  // Ball-block collisions
  blocks.forEach((block, index) => {
    if (
      ballPos[0] > block.bottomLeft[0] &&
      ballPos[0] < block.bottomRight[0] &&
      ballPos[1] > block.bottomLeft[1] &&
      ballPos[1] < block.topLeft[1]
    ) {
      brickSound.play();
      blocks.splice(index, 1);
      const blockDiv = document.querySelector(`.block[data-index="${index}"]`);
      blockDiv?.remove();
      score += 10;
      scoreDisplay.textContent = score;
      yDirection *= -1;

      // Chance to spawn power-up
      if (Math.random() < 0.3) spawnPowerUp(block.bottomLeft);
    }
  });

  // Ball falls below
  if (ballPos[1] < 0) {
    ball.remove();
    ballCurrentPositions.splice(ball.dataset.index, 1);
    lives--;
    livesDisplay.textContent = lives;

    if (lives === 0) {
      gameOverSound.play();
      clearInterval(timerId);
      alert
    }
  }
}

// Display Score
// const scoreDisplay = document.createElement('div');
scoreDisplay.classList.add('score');
scoreDisplay.innerHTML = `Score: ${score}`;
document.body.appendChild(scoreDisplay);

// Create power-ups
function createPowerUp(x, y) {
  const powerUp = document.createElement('div');
  powerUp.classList.add('power-up');
  powerUp.style.left = `${x}px`;
  powerUp.style.bottom = `${y}px`;
  grid.appendChild(powerUp);

  // Move the power-up
  const powerUpInterval = setInterval(() => {
    let bottom = parseInt(powerUp.style.bottom);
    bottom -= 2;
    powerUp.style.bottom = `${bottom}px`;

    // Check for collision with the paddle
    if (
      bottom <= currentPosition[1] + blockHeight &&
      parseInt(powerUp.style.left) >= currentPosition[0] &&
      parseInt(powerUp.style.left) <= currentPosition[0] + blockWidth
    ) {
      applyPowerUp();
      powerUp.remove();
      clearInterval(powerUpInterval);
    }

    // Remove power-up if it falls below the paddle
    if (bottom <= 0) {
      powerUp.remove();
      clearInterval(powerUpInterval);
    }
  }, 30);
}

// Apply power-up effect
function applyPowerUp() {
  const randomEffect = Math.floor(Math.random() * 3);
  switch (randomEffect) {
    case 0: // Increase paddle size
      user.style.width = `${blockWidth + 50}px`;
      setTimeout(() => (user.style.width = `${blockWidth}px`), 10000);
      break;
    case 1: // Increase ball speed
      clearInterval(timerId);
      timerId = setInterval(moveBall, 20);
      setTimeout(() => {
        clearInterval(timerId);
        timerId = setInterval(moveBall, 30);
      }, 10000);
      break;
    case 2: // Extra life
      score += 10;
      scoreDisplay.innerHTML = `Score: ${score}`;
      break;
  }
}

// Multiple balls functionality
let balls = [ball];
let ballDirections = [{ x: xDirection, y: yDirection }];

function spawnExtraBall() {
  const newBall = document.createElement('div');
  newBall.classList.add('ball');
  grid.appendChild(newBall);
  balls.push(newBall);
  ballDirections.push({ x: -xDirection, y: yDirection });
}

function moveMultipleBalls() {
  balls.forEach((ball, index) => {
    ballCurrentPosition[0] += ballDirections[index].x;
    ballCurrentPosition[1] += ballDirections[index].y;
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';

    checkForCollisions(index);
  });
}

// Add sounds
const hitSound = new Audio('sounds/hit.mp3');
const breakSound = new Audio('sounds/break.mp3');
const levelUpSound = new Audio('sounds/level-up.mp3');
const loseSound = new Audio('sounds/lose.mp3');

// Trigger sound on ball hit
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// Update collisions for multiple balls
function checkForCollisions(ballIndex) {
  for (let i = 0; i < blocks.length; i++) {
    if (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
        ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      (ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
        ballCurrentPosition[1] < blocks[i].topLeft[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      playSound(breakSound);
      changeDirection(ballIndex);

      if (Math.random() < 0.3) {
        createPowerUp(
          blocks[i].bottomLeft[0] + blockWidth / 2,
          blocks[i].bottomLeft[1] + blockHeight / 2
        );
      }

      score++;
      scoreDisplay.innerHTML = `Score: ${score}`;

      if (blocks.length === 0) {
        levelUpSound.play();
        scoreDisplay.innerHTML = 'You Win!';
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
      }
      break;
    }
  }

  // Handle ball-wall collision
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter
  ) {
    changeDirection(ballIndex);
  }

  // Ball-paddle collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    playSound(hitSound);
    changeDirection(ballIndex);
  }

  // Game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = 'Game Over!';
    playSound(loseSound);
    document.removeEventListener('keydown', moveUser);
  }
}

function changeDirection(ballIndex) {
  const ballDir = ballDirections[ballIndex];
  if (ballDir.x === 2 && ballDir.y === 2) {
    ballDir.y = -2;
  } else if (ballDir.x === 2 && ballDir.y === -2) {
    ballDir.x = -2;
  } else if (ballDir.x === -2 && ballDir.y === -2) {
    ballDir.y = 2;
  } else if (ballDir.x === -2 && ballDir.y === 2) {
    ballDir.x = 2;
  }
}

// Initialize the game
function startGame() {
  timerId = setInterval(() => {
    if (balls.length > 1) {
      moveMultipleBalls();
    } else {
      moveBall();
    }
  }, 30);
}

startGame();
