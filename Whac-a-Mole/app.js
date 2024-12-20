const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let moleTimerId = null;
let moleSpeed = 1000; // Initial speed in milliseconds
const bonusProbability = 0.2; // 20% chance for a bonus mole

function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole', 'bonus-mole'); // Remove mole styles
  });

  let randomSquare = squares[Math.floor(Math.random() * 9)];
  const isBonus = Math.random() < bonusProbability;

  if (isBonus) {
    randomSquare.classList.add('bonus-mole'); // Add bonus style
    hitPosition = { id: randomSquare.id, isBonus: true };
  } else {
    randomSquare.classList.add('mole'); // Regular mole
    hitPosition = { id: randomSquare.id, isBonus: false };
  }
}

squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (hitPosition && square.id == hitPosition.id) {
      if (hitPosition.isBonus) {
        result += 5; // Bonus mole gives 5 points
      } else {
        result++;
      }
      score.textContent = result;
      hitPosition = null;

      // Increase difficulty as score increases
      if (result % 10 === 0 && moleSpeed > 300) {
        moleSpeed -= 100; // Reduce mole speed by 100ms every 10 points
        clearInterval(moleTimerId); // Clear previous timer
        moveMole(); // Restart mole movement with new speed
      }
    }
  });
});

function moveMole() {
  moleTimerId = setInterval(randomSquare, moleSpeed);
}

function countDown() {
  currentTime--;
  timeLeft.textContent = currentTime;

  if (currentTime === 0) {
    clearInterval(countDownTimerId);
    clearInterval(moleTimerId);
    alert('GAME OVER! Your final score is ' + result);
  }
}

moveMole();
let countDownTimerId = setInterval(countDown, 1000);
