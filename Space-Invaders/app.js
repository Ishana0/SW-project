// Select necessary elements
const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
let aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let level = 1; // New: Track levels
let bossActive = false; // New: Flag to track if the boss is active

// Create the grid
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

// New: Enemy types with varying speeds and patterns
const enemyTypes = [
    { color: "purple", speed: 600, pattern: 1 }, // Basic
    { color: "blue", speed: 500, pattern: 2 },  // Zig-zag
    { color: "red", speed: 400, pattern: 3 }   // Fast
];

let alienInvaders = generateAliens(); // Initialize aliens

function generateAliens() {
    const aliens = [];
    for (let i = 0; i < 30; i++) {
        aliens.push(i < 10 ? 0 + i : i < 20 ? 15 + (i - 10) : 30 + (i - 20));
    }
    return aliens;
}

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader");
            squares[alienInvaders[i]].style.backgroundColor = enemyTypes[level - 1]?.color || "purple"; // Color by level
        }
    }
}

draw();

squares[currentShooterIndex].classList.add("shooter");

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            isGoingRight = false;
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            isGoingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    // Check for game over
    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId);
    }

    // Check for level completion
    if (aliensRemoved.length === alienInvaders.length && !bossActive) {
        clearInterval(invadersId);
        if (level < enemyTypes.length) {
            level++;
            aliensRemoved = [];
            alienInvaders = generateAliens();
            invadersId = setInterval(moveInvaders, enemyTypes[level - 1].speed);
        } else {
            activateBoss();
        }
    }
}

invadersId = setInterval(moveInvaders, enemyTypes[level - 1].speed);

function activateBoss() {
    bossActive = true;
    let bossHealth = 5; // Boss health
    squares[7].classList.add("boss"); // Mark the boss on the grid

    const bossMove = setInterval(() => {
        if (bossHealth === 0) {
            clearInterval(bossMove);
            resultDisplay.innerHTML = "YOU WIN";
        }
    }, 1000);
}

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add("laser");

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = results;
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener("keydown", shoot);
