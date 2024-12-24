const gridDisplay = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result');
const timerDisplay = document.querySelector('#timer');
const bestTimeDisplay = document.querySelector('#best-time');
const difficultyButtons = document.querySelectorAll('#difficulty button');

let cardArray = [];
let cardsChosen = [];
let cardsChosenIds = [];
const cardsWon = [];
let timer = 0;
let interval;
let bestTime = localStorage.getItem('bestTime') || null;
let lockBoard = false; // Prevent additional flips during match check
const flipDelay = 1000; // Time (in ms) to show mismatched cards before flipping back

// Update best time on the UI
if (bestTime) bestTimeDisplay.textContent = `${bestTime} seconds`;

// Shuffle cards and set the difficulty
function shuffleCards(difficulty) {
    const baseCards = [
        { name: 'fries', img: 'Image-files/images/fries.png' },
        { name: 'cheeseburger', img: 'Image-files/images/cheeseburger.png' },
        { name: 'hotdog', img: 'Image-files/images/hotdog.png' },
        { name: 'ice-cream', img: 'Image-files/images/ice-cream.png' },
        { name: 'milkshake', img: 'Image-files/images/milkshake.png' },
        { name: 'pizza', img: 'Image-files/images/pizza.png' },
    ];

    // Adjust the number of cards based on difficulty
    const multiplier = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    cardArray = [...baseCards.slice(0, multiplier), ...baseCards.slice(0, multiplier)];
    cardArray.sort(() => 0.5 - Math.random());
    createBoard();
}

// Create the game board
function createBoard() {
    gridDisplay.innerHTML = '';
    cardArray.forEach((_, i) => {
        const card = document.createElement('img');
        card.setAttribute('src', 'Image-files/images/blank.png');
        card.setAttribute('data-id', i);
        card.addEventListener('click', flipCard);
        gridDisplay.appendChild(card);
    });
    startTimer();
}

// Start the timer
function startTimer() {
    clearInterval(interval);
    timer = 0;
    timerDisplay.textContent = timer;
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

// Stop the timer and update best time if applicable
function stopTimer() {
    clearInterval(interval);
    if (!bestTime || timer < bestTime) {
        bestTime = timer;
        localStorage.setItem('bestTime', bestTime);
        bestTimeDisplay.textContent = `${bestTime} seconds`;
    }
}

// Flip a card
function flipCard() {
    if (lockBoard) return; // Prevent flipping if lockBoard is true 
    const cardId = this.getAttribute('data-id');
    if (cardsChosenIds.includes(cardId)) return; // Avoid double-clicking the same card

    cardsChosen.push(cardArray[cardId].name);
    cardsChosenIds.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    this.classList.add('flipped');

    if (cardsChosen.length === 2) {
        lockBoard = true; // Lock the board while checking for a match
        setTimeout(checkMatch, flipDelay);
    }
}

// Check for a match
function checkMatch() {
    const cards = document.querySelectorAll('img');
    const [optionOneId, optionTwoId] = cardsChosenIds;

    if (optionOneId === optionTwoId) {
        alert('You clicked the same card!');
        setTimeout(() => {
            cards[optionOneId].setAttribute('src', 'Image-files/images/blank.png');
        }, flipDelay);
    } else if (cardsChosen[0] === cardsChosen[1]) {
        // If it's a match
        cards[optionOneId].classList.add('match');
        cards[optionTwoId].classList.add('match');
        cards[optionOneId].removeEventListener('click', flipCard);
        cards[optionTwoId].removeEventListener('click', flipCard);
        cardsWon.push(cardsChosen);
        resultDisplay.textContent = cardsWon.length;
    } else {
        // If it's not a match, delay flipping back
        setTimeout(() => {
            cards[optionOneId].setAttribute('src', 'Image-files/images/blank.png');
            cards[optionTwoId].setAttribute('src', 'Image-files/images/blank.png');
        }, flipDelay);
    }

    // Always reset choices and unlock board AFTER delay
    setTimeout(() => {
        cardsChosen = [];
        cardsChosenIds = [];
        lockBoard = false;

        // Check if the game is won
        if (cardsWon.length === cardArray.length / 2) {
            resultDisplay.textContent = 'Congratulations, you found all matches!';
            stopTimer();
        }
    }, flipDelay);
}

// Add event listeners to difficulty buttons
difficultyButtons.forEach((button) =>
    button.addEventListener('click', () => {
        shuffleCards(button.id);
    })
);
