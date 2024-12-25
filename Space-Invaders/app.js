const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
const aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let level = 1;
let alienInvaders = [];
let bossInvader = null;

// Function to generate a new level
function generateLevel(level) {
    alienInvaders = [];
    if (level === 1) {
        // Normal Invaders for Level 1
        for (let i = 0; i < 30; i++) {
            alienInvaders.push(i);
        }
    } else if (level === 2) {
        // Add different patterns for higher levels
        for (let i = 0; i < 25; i++) {
            alienInvaders.push(i);
        }
    }
    draw();
}

// Create the grid
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));
squares[currentShooterIndex].classList.add("shooter");

// Function to draw the invaders
function draw() {
    squares.forEach(square => square.classList.remove("invader", "boss", "laser", "boom"));
    
    // Draw regular invaders
    alienInvaders.forEach(index => squares[index].classList.add("invader"));
    
    // Draw boss invader at the end of the level
    if (bossInvader) {
        squares[bossInvader].classList.add("boss");
    }
}

// Move shooter left and right
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

// Remove invaders
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

// Move invaders and check for collisions
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        alienInvaders = alienInvaders.map(i => i + width + 1);
        direction = -1;
        isGoingRight = false;
    }

    if (leftEdge && !isGoingRight) {
        alienInvaders = alienInvaders.map(i => i + width - 1);
        direction = 1;
        isGoingRight = true;
    }

    alienInvaders = alienInvaders.map(i => i + direction);
    draw();

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId);
    }

    if (alienInvaders.length === 0) {
        results++;
        level++;
        resultDisplay.innerHTML = `Level: ${level} | Score: ${results}`;
        clearInterval(invadersId);
        if (level <= 2) {
            generateLevel(level);
            invadersId = setInterval(moveInvaders, 600 - level * 100);
        } else {
            resultDisplay.innerHTML = "YOU WIN!";
            clearInterval(invadersId);
        }
    }

    // Boss Invader Movement (moves in a zig-zag pattern)
    if (bossInvader !== null) {
        squares[bossInvader].classList.remove("boss");
        bossInvader += 1;
        if (bossInvader % width === 0) bossInvader += 1;
        squares[bossInvader].classList.add("boss");
    }
}

// Add a boss at the end of the level
function addBoss() {
    bossInvader = alienInvaders.length - 1;
    squares[bossInvader].classList.add("boss");
}

// Shoot laser
function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        // Remove the previous laser
        squares[currentLaserIndex].classList.remove("laser");

        // Move laser upwards
        currentLaserIndex -= width;

        // Add the new laser position
        squares[currentLaserIndex].classList.add("laser");

        // Check for collision with invader or boss
        if (squares[currentLaserIndex].classList.contains("invader")) {
            // Laser hits invader: remove invader, remove laser, add explosion effect
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);

            // Remove the invader from the array
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            if (alienRemoved > -1) alienInvaders.splice(alienRemoved, 1); // Remove invader from array

            results++;
            resultDisplay.innerHTML = `Score: ${results}`;
            clearInterval(laserId);
        }

        // Check for collision with boss
        if (squares[currentLaserIndex].classList.contains("boss")) {
            // Laser hits boss: remove boss, remove laser, add explosion effect
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("boss");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);

            // Remove the boss
            bossInvader = null;  // Boss is destroyed

            results += 5; // Extra points for boss
            resultDisplay.innerHTML = `Score: ${results}`;
            clearInterval(laserId);
        }

        // If the laser goes off screen, remove it
        if (currentLaserIndex < width) {
            clearInterval(laserId);
            squares[currentLaserIndex].classList.remove("laser");
        }
    }

    // Fire laser when the up arrow is pressed
    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
    }
}


document.addEventListener('keydown', shoot);

// Start game
generateLevel(level);
invadersId = setInterval(moveInvaders, 600);