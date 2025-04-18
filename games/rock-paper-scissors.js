// Rock Paper Scissors Game

document.addEventListener('DOMContentLoaded', function() {
    
    const options = document.querySelectorAll('.rps-option');
    const playerScoreElement = document.getElementById('player-score');
    const computerScoreElement = document.getElementById('computer-score');
    const drawsElement = document.getElementById('draws');
    const gameStatus = document.getElementById('game-status');
    const resultDisplay = document.getElementById('result-display');
    const playerChoiceDisplay = document.getElementById('player-choice');
    const computerChoiceDisplay = document.getElementById('computer-choice');
    const resultMessage = document.getElementById('result-message');
    const resetButton = document.getElementById('reset-game');

    
    let playerScore = 0;
    let computerScore = 0;
    let draws = 0;

    
    function loadScores() {
        const savedScores = localStorage.getItem('rpsScores');
        if (savedScores) {
            const scores = JSON.parse(savedScores);
            playerScore = scores.player;
            computerScore = scores.computer;
            draws = scores.draws;
            updateScoreDisplay();
        }
    }

    
    function saveScores() {
        const scores = {
            player: playerScore,
            computer: computerScore,
            draws: draws
        };
        localStorage.setItem('rpsScores', JSON.stringify(scores));
    }

    function updateScoreDisplay() {
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        drawsElement.textContent = draws;
    }

    
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }

    
    function formatChoice(choice) {
        let icon = '';
        switch(choice) {
            case 'rock':
                icon = '<i class="fas fa-hand-rock"></i>';
                break;
            case 'paper':
                icon = '<i class="fas fa-hand-paper"></i>';
                break;
            case 'scissors':
                icon = '<i class="fas fa-hand-scissors"></i>';
                break;
        }
        return `${icon} ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;
    }

    
    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'player';
        }
        
        return 'computer';
    }

    
    function playGame(playerChoice) {
        const computerChoice = getComputerChoice();
        const winner = determineWinner(playerChoice, computerChoice);
        
        
        playerChoiceDisplay.innerHTML = formatChoice(playerChoice);
        computerChoiceDisplay.innerHTML = formatChoice(computerChoice);
        resultDisplay.style.display = 'block';
        
        
        let resultClass = '';
        
        switch(winner) {
            case 'player':
                resultMessage.textContent = 'You Win!';
                resultClass = 'win';
                playerScore++;
                break;
            case 'computer':
                resultMessage.textContent = 'Computer Wins!';
                resultClass = 'lose';
                computerScore++;
                break;
            case 'draw':
                resultMessage.textContent = "It's a Draw!";
                resultClass = 'draw';
                draws++;
                break;
        }
        
        
        resultMessage.className = 'result-message ' + resultClass;
        
        
        updateScoreDisplay();
        
        
        saveScores();
    }

    
    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        draws = 0;
        updateScoreDisplay();
        saveScores();
        resultDisplay.style.display = 'none';
        gameStatus.innerHTML = '<p>Choose your weapon!</p>';
    }

    
    options.forEach(option => {
        option.addEventListener('click', function() {
            const playerChoice = this.getAttribute('data-choice');
            playGame(playerChoice);
        });
    });

    
    resetButton.addEventListener('click', resetGame);

    
    loadScores();
}); 