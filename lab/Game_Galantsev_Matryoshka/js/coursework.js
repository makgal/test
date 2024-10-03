document.addEventListener('DOMContentLoaded', () => {
    let loginForm = document.getElementById('login_form');
    let welcomeContainer = document.getElementById('welcome_container');
    let welcomePhrase = document.getElementById('welcome_phrase');
    let usernameInput = document.getElementById('username');
    let logoutButton = document.getElementById('logout_button');

    let savedUsername = localStorage.getItem('username');
    localStorage.setItem('finalScoreLevel1', 0);
    localStorage.setItem('finalScoreLevel2', 0);
    localStorage.setItem('finalScoreLevel3', 0);

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let username = usernameInput.value;

        if (username) {
            localStorage.setItem('username', username);
            showWelcomeMessage(username);
        }
    })

    if (savedUsername) {
        showWelcomeMessage(savedUsername);
    }
    else {
        welcomeContainer.style.display = 'none';
    }

    function showWelcomeMessage(username) {
        loginForm.style.display = 'none';
        welcomeContainer.style.display = 'block';
        welcomePhrase.textContent = `Добро пожаловать, ${username}!`;
    }

    logoutButton.addEventListener('click', function(e) {
        console.log(132);
        e.preventDefault();
        localStorage.removeItem('username');
        localStorage.removeItem('bestScore');
        localStorage.removeItem('finalScore1');
        localStorage.removeItem('finalScore2');
        localStorage.removeItem('finalScore3');
        location.reload();
    });

});