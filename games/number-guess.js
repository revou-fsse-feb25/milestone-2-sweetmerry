// Number Guessing Game

document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-guess');
    const hintMessage = document.getElementById('hint-message');
    const attemptsLeft = document.getElementById('attempts-left');
    const gameRestartDiv = document.getElementById('game-restart');
    const restartButton = document.getElementById('restart-game');
    const gameForm = document.getElementById('game-form');
    const gameStatus = document.getElementById('game-status');
    const progressBar = document.getElementById('progress-bar');
    const previousGuessesContainer = document.getElementById('previous-guesses');
    const hintContainer = document.getElementById('hint-container');

    // Sound effects
    const correctSound = new Audio('../assets/sounds/correct.mp3');
    const wrongSound = new Audio('../assets/sounds/wrong.mp3');
    const gameOverSound = new Audio('../assets/sounds/game-over.mp3');

    // Try to preload sounds silently
    try {
        correctSound.volume = 0;
        wrongSound.volume = 0;
        gameOverSound.volume = 0;
        correctSound.play().then(() => correctSound.pause()).catch(() => {});
        wrongSound.play().then(() => wrongSound.pause()).catch(() => {});
        gameOverSound.play().then(() => gameOverSound.pause()).catch(() => {});
    } catch (e) {
        console.log('Audio preload not supported');
    }

    // Game variables
    let targetNumber;
    let attempts;
    let maxAttempts = 5;
    let gameOver = false;
    let previousGuesses = [];

    // Initialize game
    function initGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        gameOver = false;
        previousGuesses = [];
        
        // Reset UI elements
        guessInput.value = '';
        hintMessage.textContent = '';
        hintMessage.className = 'hint-message';
        attemptsLeft.textContent = maxAttempts;
        previousGuessesContainer.innerHTML = '';
        gameRestartDiv.style.display = 'none';
        gameForm.style.display = 'flex';
        hintContainer.style.display = 'block';
        progressBar.style.width = '100%';
        
        gameStatus.innerHTML = '<p>I\'m thinking of a number between 1 and 100.</p><p>Can you guess it within 5 tries?</p>';
        
        // Focus on input
        guessInput.focus();

        console.log('Game initialized. Target number:', targetNumber);
    }

    // Process guess
    function processGuess() {
        if (gameOver) return;
        
        // Get user's guess
        const userGuess = parseInt(guessInput.value);
        
        // Validate input
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            showHint('Please enter a valid number between 1 and 100.', 'error');
            guessInput.value = '';
            guessInput.focus();
            return;
        }
        
        // Check if already guessed
        if (previousGuesses.includes(userGuess)) {
            showHint('You already tried that number!', 'error');
            guessInput.value = '';
            guessInput.focus();
            return;
        }
        
        // Increment attempts
        attempts++;
        previousGuesses.push(userGuess);
        
        // Update attempts display
        attemptsLeft.textContent = maxAttempts - attempts;
        
        // Update progress bar
        progressBar.style.width = `${((maxAttempts - attempts) / maxAttempts) * 100}%`;
        
        // Add guess bubble
        addGuessBubble(userGuess);
        
        // Process the guess
        if (userGuess === targetNumber) {
            // Player wins
            gameWin();
        } else {
            // Play wrong sound
            try {
                wrongSound.volume = 0.2;
                wrongSound.play().catch(() => {});
            } catch (e) {}
            
            // Provide hint
            const hint = userGuess < targetNumber ? 'Too low!' : 'Too high!';
            const hintClass = userGuess < targetNumber ? 'hint-too-low' : 'hint-too-high';
            showHint(hint, hintClass);
            
            // Check if max attempts reached
            if (attempts >= maxAttempts) {
                gameLose();
            }
        }
        
        // Clear input and focus
        guessInput.value = '';
        guessInput.focus();
    }

    // Show hint with appropriate styling
    function showHint(message, type) {
        hintMessage.textContent = message;
        hintMessage.className = 'hint-message';
        
        if (type) {
            hintMessage.classList.add(type);
        }
    }

    // Add guess bubble to display
    function addGuessBubble(guess) {
        const bubble = document.createElement('div');
        bubble.className = 'guess-bubble';
        bubble.textContent = guess;
        
        // Color coding based on distance
        const distance = Math.abs(guess - targetNumber);
        let color;
        
        if (distance === 0) {
            color = '#4caf50'; // Green for correct
        } else if (distance <= 5) {
            color = '#ff9800'; // Orange for very close
        } else if (distance <= 15) {
            color = '#ffeb3b'; // Yellow for close
        } else if (distance <= 30) {
            color = '#2196f3'; // Blue for somewhat off
        } else {
            color = '#f44336'; // Red for far off
        }
        
        bubble.style.backgroundColor = color;
        bubble.style.color = distance <= 15 ? '#000' : '#fff';
        
        previousGuessesContainer.appendChild(bubble);
    }

    // Game win condition
    function gameWin() {
        gameOver = true;
        
        // Play correct sound
        try {
            correctSound.volume = 0.3;
            correctSound.play().catch(() => {});
        } catch (e) {}
        
        showHint(`Congratulations! You guessed the number ${targetNumber} in ${attempts} attempts!`, 'hint-correct');
        
        // Add win animation
        gameStatus.classList.add('win-animation');
        
        endGame();
    }

    // Game lose condition
    function gameLose() {
        gameOver = true;
        
        // Play game over sound
        try {
            gameOverSound.volume = 0.3;
            gameOverSound.play().catch(() => {});
        } catch (e) {}
        
        showHint(`Game over! The number was ${targetNumber}.`, 'game-over');
        endGame();
    }

    // End game and show restart button
    function endGame() {
        gameForm.style.display = 'none';
        gameRestartDiv.style.display = 'block';
        
        // Save to local storage
        saveScore();
    }

    // Save score to localStorage
    function saveScore() {
        if (!gameOver || attempts > maxAttempts) return;
        
        // Only save if player won
        if (previousGuesses[previousGuesses.length - 1] !== targetNumber) return;
        
        // Get existing scores or create new array
        let scores = JSON.parse(localStorage.getItem('numberGuessScores')) || [];
        
        // Get username or use default
        let username = localStorage.getItem('username') || 'Player';
        
        // Add new score
        scores.push({
            username: username,
            attempts: attempts,
            maxAttempts: maxAttempts,
            date: new Date().toISOString()
        });
        
        // Sort scores (lower attempts are better)
        scores.sort((a, b) => a.attempts - b.attempts);
        
        // Keep only top 10 scores
        scores = scores.slice(0, 10);
        
        // Save back to localStorage
        localStorage.setItem('numberGuessScores', JSON.stringify(scores));
    }

    // Event listeners
    submitButton.addEventListener('click', processGuess);
    
    guessInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            processGuess();
        }
    });
    
    restartButton.addEventListener('click', function() {
        gameStatus.classList.remove('win-animation');
        initGame();
    });

    // Start the game
    initGame();
}); 