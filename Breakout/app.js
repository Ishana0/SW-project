const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const livesDisplay = document.querySelector('#lives')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = -2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = [...ballStart]

let timerId
let score = 0
let lives = 3
let balls = [ballCurrentPosition] // Track multiple balls
let ballTimers = [] // Timers for each ball

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'
    grid.appendChild(block)
  }
}
addBlocks()

const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// Move user
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10
        drawUser()
      }
      break
    case 'ArrowRight':
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10
        drawUser()
      }
      break
  }
}
document.addEventListener('keydown', moveUser)

// Power-ups
function spawnPowerUp(x, y) {
  const powerUp = document.createElement('div')
  powerUp.classList.add('power-up')
  powerUp.style.left = x + 'px'
  powerUp.style.bottom = y + 'px'
  grid.appendChild(powerUp)

  let powerUpTimer = setInterval(() => {
    let powerUpBottom = parseInt(powerUp.style.bottom)
    powerUp.style.bottom = powerUpBottom - 2 + 'px'

    // Check collision with paddle
    if (
      powerUpBottom <= currentPosition[1] + blockHeight &&
      parseInt(powerUp.style.left) >= currentPosition[0] &&
      parseInt(powerUp.style.left) <= currentPosition[0] + blockWidth
    ) {
      grid.removeChild(powerUp)
      clearInterval(powerUpTimer)
      applyPowerUp()
    }

    // Remove power-up if it goes off the grid
    if (powerUpBottom <= 0) {
      grid.removeChild(powerUp)
      clearInterval(powerUpTimer)
    }
  }, 30)
}

function applyPowerUp() {
  // Random power-up effects
  const effect = Math.floor(Math.random() * 3)
  if (effect === 0) {
    // Increase paddle size
    user.style.width = '150px'
    setTimeout(() => (user.style.width = '100px'), 10000)
  } else if (effect === 1) {
    // Increase ball speed
    xDirection *= 1.5
    yDirection *= 1.5
    setTimeout(() => {
      xDirection /= 1.5
      yDirection /= 1.5
    }, 10000)
  } else if (effect === 2) {
    // Extra life
    lives++
    livesDisplay.innerText = lives
  }
}