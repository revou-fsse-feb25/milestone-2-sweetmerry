//Clicker Game

document.addEventListener('DOMContentLoaded', function() {
    
    const clickButton = document.getElementById('click-button');
    const startButton = document.getElementById('start-game');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const usernameInput = document.getElementById('username-input');
    const saveUsernameButton = document.getElementById('save-username');
    const leaderboardBody = document.getElementById('leaderboard-body');


    let score = 0;
    let timer = 10;
    let gameActive = false;
    let timerInterval;
    let username = 'Player';

    function init() {
    
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            username = savedUsername;
            usernameInput.value = savedUsername;
        }

        
        loadLeaderboard();

        
        clickButton.classList.add('disabled');
    }

    
    function startGame() {
        if (gameActive) return;
        
        
        score = 0;
        timer = 10;
        gameActive = true;
        
        
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timer;
        
        
        clickButton.classList.remove('disabled');
        
        
        timerInterval = setInterval(updateTimer, 1000);
        
        
        startButton.disabled = true;
    }

    function updateTimer() {
        timer--;
        timerDisplay.textContent = timer;
        
        if (timer <= 0) {
            endGame();
        }
    }

    
    function endGame() {
        clearInterval(timerInterval);
        gameActive = false;
        
        
        clickButton.classList.add('disabled');
        
        
        startButton.disabled = false;
        
        
        saveScore();
        
        
        loadLeaderboard();
    }

    
    function handleClick() {
        if (!gameActive) return;
        
        score++;
        scoreDisplay.textContent = score;
        
        createClickAnimation();
    }

        function createClickAnimation() {
        const animation = document.createElement('div');
        animation.textContent = '+1';
        animation.classList.add('click-animation');
        
        
        const buttonRect = clickButton.getBoundingClientRect();
        const randomOffsetX = Math.random() * 60 - 30;  
        
        animation.style.left = (buttonRect.left + buttonRect.width / 2 + randomOffsetX) + 'px';
        animation.style.top = (buttonRect.top) + 'px';
        
        document.body.appendChild(animation);
        
        
        setTimeout(() => {
            animation.remove();
        }, 1500);
    }

    
    function saveUsername() {
        const newUsername = usernameInput.value.trim();
        if (newUsername) {
            username = newUsername;
            localStorage.setItem('username', username);
            alert('Username saved!');
        } else {
            alert('Please enter a valid username.');
        }
    }

    
    function saveScore() {
        
        let scores = JSON.parse(localStorage.getItem('clickerScores')) || [];
        
        
        scores.push({
            username: username,
            score: score,
            date: new Date().toISOString().split('T')[0]  
        });
        
        
        scores.sort((a, b) => b.score - a.score);
        
        
        scores = scores.slice(0, 10);
        
        localStorage.setItem('clickerScores', JSON.stringify(scores));
    }

    
    function loadLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('clickerScores')) || [];
        
        
        leaderboardBody.innerHTML = '';
        
        
        scores.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.username}</td>
                <td>${entry.score}</td>
                <td>${entry.date}</td>
            `;
            
            leaderboardBody.appendChild(row);
        });
        
        
        for (let i = scores.length; i < 5; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;
            leaderboardBody.appendChild(row);
        }
    }

    
    clickButton.addEventListener('click', handleClick);
    startButton.addEventListener('click', startGame);
    saveUsernameButton.addEventListener('click', saveUsername);

   
    init();
}); 