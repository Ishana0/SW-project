const computerSelectionDisplay = document.getElementById("computer-selection");
const playerSelectionDisplay = document.getElementById("player-selection");
const outcomeDisplay = document.getElementById("outcome");
const options = document.querySelectorAll(".button");
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const resetButton = document.getElementById('reset-btn');
let playerSelection;
let computerSelection;
let outcome;
let playerScore = 0;
let computerScore = 0;

resetButton.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    playerSelectionDisplay.innerHTML = "None";
    computerSelectionDisplay.innerHTML = "None";
    outcomeDisplay.innerHTML = "Game has been reset!";
    playerScoreDisplay.innerHTML = playerScore;
    computerScoreDisplay.innerHTML = computerScore;
});

options.forEach(option => option.addEventListener('click', (e) => {
    playerSelection = e.target.id;
    playerSelectionDisplay.innerHTML = playerSelection;
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
    } else if (computerSelection === "rock") {
        if (playerSelection === "scissors") {
            outcome = "Computer wins!";
            computerScore++;
        } else if (playerSelection === "paper") {
            outcome = "Player wins!";
            playerScore++;
        }
    } else if (computerSelection === "paper") {
        if (playerSelection === "scissors") {
            outcome = "Player wins!";
            playerScore++;
        } else if (playerSelection === "rock") {
            outcome = "Computer wins!";
            computerScore++;
        }
    } else if (computerSelection === "scissors") {
        if (playerSelection === "rock") {
            outcome = "Player wins!";
            playerScore++;
        } else {
            outcome = "Computer wins!";
            computerScore++;
        }
    }
    outcomeDisplay.innerHTML = outcome;
    playerScoreDisplay.innerHTML = playerScore;
    computerScoreDisplay.innerHTML = computerScore;
}
