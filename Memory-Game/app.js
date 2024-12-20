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

if (bestTime) bestTimeDisplay.textContent = `${bestTime} seconds`;

function shuffleCards(difficulty) {
    const baseCards = [
        { name: 'fries', img: 'Image-files/images/fries.png' },
        { name: 'cheeseburger', img: 'Image-files/images/cheeseburger.png' },
        { name: 'hotdog', img: 'Image-files/images/hotdog.png' },
        { name: 'ice-cream', img: 'Image-files/images/ice-cream.png' },
        { name: 'milkshake', img: 'Image-files/images/milkshake.png' },
        { name: 'pizza', img: 'Image-files/images/pizza.png' },
    ];

    const multiplier = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    cardArray = [...baseCards.slice(0, multiplier), ...baseCards.slice(0, multiplier)];
    cardArray.sort(() => 0.5 - Math.random());
    createBoard();
}

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

function startTimer() {
    clearInterval(interval);
    timer = 0;
    timerDisplay.textContent = timer;
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    if (!bestTime || timer < bestTime) {
        bestTime = timer;
        localStorage.setItem('bestTime', bestTime);
        bestTimeDisplay.textContent = `${bestTime} seconds`;
    }
}

function flipCard() {
    const cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenIds.push(cardId);
    this.classList.add('flipped');
    this.setAttribute('src', cardArray[cardId].img);

    if (cardsChosen.length === 2) setTimeout(checkMatch, 500);
}

function checkMatch() {
    const cards = document.querySelectorAll('img');
    const [optionOneId, optionTwoId] = cardsChosenIds;

    if (optionOneId === optionTwoId) {
        alert('You clicked the same card!');
        cards[optionOneId].setAttribute('src', 'Image-files/images/blank.png');
    } else if (cardsChosen[0] === cardsChosen[1]) {
        cards[optionOneId].classList.add('match');
        cards[optionTwoId].classList.add('match');
        cardsWon.push(cardsChosen);
        resultDisplay.textContent = cardsWon.length;
    } else {
        cards[optionOneId].setAttribute('src', 'Image-files/images/blank.png');
        cards[optionTwoId].setAttribute('src', 'Image-files/images/blank.png');
    }

    cardsChosen = [];
    cardsChosenIds = [];

    if (cardsWon.length === cardArray.length / 2) {
        resultDisplay.textContent = 'Congratulations, you found all matches!';
        stopTimer();
    }
}

difficultyButtons.forEach((button) =>
    button.addEventListener('click', () => {
        shuffleCards(button.id);
    })
);
