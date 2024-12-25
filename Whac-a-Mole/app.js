const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let moleTimerId = null;

// Function to generate a random square and assign a type of mole
function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole', 'bonus-mole'); // Clear previous mole styles
  });

  let randomSquare = squares[Math.floor(Math.random() * 9)];
  
  // Enhancement: Randomly decide whether to make this a "bonus" mole
  if (Math.random() > 0.8) { // 20% chance for bonus mole
    randomSquare.classList.add('bonus-mole'); // Bonus mole style
    randomSquare.dataset.points = 5; // Assign 5 points for bonus mole
  } else {
    randomSquare.classList.add('mole'); // Regular mole style
    randomSquare.dataset.points = 1; // Assign 1 point for regular mole
  }

  hitPosition = randomSquare.id; // Set the mole's position for tracking
}

// Function to dynamically adjust mole speed based on score
function moveMole() {
  clearInterval(moleTimerId); // Clear existing mole timer

  // Enhancement: Reduce mole interval as score increases to increase difficulty
  let speed = Math.max(300, 1000 - result * 50); // Minimum speed is 300ms
  moleTimerId = setInterval(randomSquare, Math.random() * speed + 300); // Randomize timing slightly
}

// Event listener to track hits on moles
squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (square.id == hitPosition) { // Check if the correct mole is hit
      result += parseInt(square.dataset.points); // Add points based on mole type
      score.textContent = result; // Update score dynamically
      hitPosition = null; // Reset hit position
      moveMole(); // Enhancement: Adjust speed dynamically based on score
    }
  });
});

// Countdown timer
function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(countDownTimerId); // Stop countdown
    clearInterval(moleTimerId); // Stop mole movements
    alert('GAME OVER! Your final score is ' + result);
  }
}

let countDownTimerId = setInterval(countDown, 1000); // Start the countdown

// Start the mole movement
moveMole();