const computerSelectionDisplay = document.getElementById("computer-selection");
const playerSelectionDisplay = document.getElementById("player-selection");
const outcomeDisplay = document.getElementById("outcome");
const options = document.querySelectorAll(".button");
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const resetButton = document.getElementById('reset-btn');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');
const tiesDisplay = document.getElementById('ties');

let playerSelection;
let computerSelection;
let outcome;
let playerScore = 0;
let computerScore = 0;
let wins = 0;
let losses = 0;
let ties = 0;

resetButton.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    wins = 0;
    losses = 0;
    ties = 0;
    playerSelectionDisplay.innerHTML = "None";
    computerSelectionDisplay.innerHTML = "None";
    outcomeDisplay.innerHTML = "Game has been reset!";
    playerScoreDisplay.innerHTML = playerScore;
    computerScoreDisplay.innerHTML = computerScore;
    winsDisplay.innerHTML = wins;
    lossesDisplay.innerHTML = losses;
    tiesDisplay.innerHTML = ties;
});

options.forEach(option => option.addEventListener('click', (e) => {
    playerSelection = e.target.id;
    playerSelectionDisplay.innerHTML = playerSelection;
    e.target.classList.add('highlight'); // Add animation
    setTimeout(() => e.target.classList.remove('highlight'), 500); // Remove animation
    determineComputerSelection();
    calculateOutcome();
}));

function determineComputerSelection() { 
    const choices = ['rock', 'paper', 'scissors'];
    computerSelection = choices[Math.floor(Math.random() * 3)];
    computerSelectionDisplay.innerHTML = computerSelection;
}

function calculateOutcome() {
    if (computerSelection === playerSelection) {
        outcome = "It's a draw!";
        ties++;
    } else if (
        (computerSelection === "rock" && playerSelection === "scissors") ||
        (computerSelection === "paper" && playerSelection === "rock") ||
        (computerSelection === "scissors" && playerSelection === "paper")
    ) {
        outcome = "Computer wins!";
        computerScore++;
        losses++;
    } else {
        outcome = "Player wins!";
        playerScore++;
        wins++;
    }
    updateDisplay();
}

function updateDisplay() {
    outcomeDisplay.innerHTML = `${outcome} (Player: ${playerSelection}, Computer: ${computerSelection})`;
    playerScoreDisplay.innerHTML = playerScore;
    computerScoreDisplay.innerHTML = computerScore;
    winsDisplay.innerHTML = wins;
    lossesDisplay.innerHTML = losses;
    tiesDisplay.innerHTML = ties;
}