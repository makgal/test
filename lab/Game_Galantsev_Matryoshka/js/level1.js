document.addEventListener('DOMContentLoaded', () => {
    let colors = ['red', 'blue', 'green', 'purple', 'yellow'];
    shuffleArray(colors);

    let colorsRussian = new Map([
        ['red', 'красный'],
        ['blue', 'синий'],
        ['green', 'зелёный'],
        ['purple', 'фиолетовый'],
        ['yellow', 'жёлтый']
    ]);

    let sizes = ['small', 'medium', 'large'];

    let matryoshkas = [];
    let score = 0;
    let finalScore = 0;
    let timeLeft = 10;
    let penalties = 0;

    let numCorrectMatryoshka = 3;

    let timeRound = 10;
    let timerInterval = timeRound;

    let currentColorIndex = 0;
    let selectedColor = colors[currentColorIndex];

    let container = document.getElementById('matryoshka-container');
    let taskDiv = document.getElementById('taskText');
    let timerDiv = document.getElementById('timer');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateMatryoshkas() {
        matryoshkas = [];
        for (let currentColor of colors) {
            for (let i = 0; i < numCorrectMatryoshka; i++) {
                let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                matryoshkas.push({ color: currentColor, size: randomSize });
            }
        }
        shuffleArray(matryoshkas);
    }

    function createMatryoshkas() {
        container.innerHTML = '';

        matryoshkas.forEach(matryoshka => {
            let matryoshkaDiv = document.createElement('div');
            matryoshkaDiv.classList.add('matryoshka');

            let img = document.createElement('img');
            img.src = `../images/${matryoshka.color}_matryoshka.png`;
            img.classList.add(matryoshka.size);

            matryoshkaDiv.appendChild(img);
            container.appendChild(matryoshkaDiv);

            matryoshkaDiv.addEventListener('click', () => {
                if (matryoshka.color == selectedColor) {
                    matryoshkaDiv.classList.add('fade');

                    setTimeout(function () {
                        matryoshkaDiv.style.display = 'none';
                        checkWinCondition();
                    }, 290)

                } else {
                    penalties++;
                    alert(`Эта матрёшка неправильного цвета!`);
                }
            });
        });
    }

    function startTimer() {
        timeLeft = timeRound;
        timerDiv.textContent = `Время: ${timeLeft} секунд`;

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDiv.textContent = `Время: ${timeLeft} секунд`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Время вышло!');
                moveToNextLevel();
            }
        }, 1000);
    }

    function checkWinCondition() {
        let remainingMatryoshkas = Array.from(document.querySelectorAll(`.matryoshka img[src*="${selectedColor}_matryoshka.png"]`))
            .filter(img => img.parentElement.style.display != 'none');

        if (remainingMatryoshkas.length == 0) {
            clearInterval(timerInterval);
            calculateScore();
            alert(`Поздравляем! Вы выбрали всех нужных матрёшек! Вы набрали очков: ${score}. Можем идти дальше!`);
            finalScore += score;
            moveToNextLevel();
        }
    }

    function calculateScore() {
        let stageScore = timeLeft - penalties;
        if (stageScore < 0) stageScore = 0;
        score += stageScore;
    }

    function moveToNextLevel() {
        currentColorIndex++;
        if (currentColorIndex < colors.length) {
            selectedColor = colors[currentColorIndex];
            timeRound += 5;
            numCorrectMatryoshka++;
            start();
        } else {
            if (finalScore > 0) {
                alert(`Поздравляем! Вы завершили уровень! За все этапы вы набрали очков: ${finalScore}`);
                localStorage.setItem('finalScoreLevel1', finalScore);
                localStorage.setItem('finalScoreLevel2', 0);
                localStorage.setItem('finalScoreLevel3', 0);
                window.location.href = "level2_rules.html";
            } else {
                alert(`К сожалению, вы набрали 0 очков. Начните всю игру заново!`);
                window.location.href = "level1_rules.html";
            }
        }
    }

    function start() {
        generateMatryoshkas();
        taskDiv.textContent = `Выберите всех матрёшек следующего цвета: ${colorsRussian.get(selectedColor)}`;
        score = 0;
        penalties = 0;
        createMatryoshkas();
        startTimer();
        window.scrollTo(0, document.body.scrollHeight);
    }

    start();
});