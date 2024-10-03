document.addEventListener('DOMContentLoaded', () => {
    let colors = ['red', 'blue', 'green', 'purple', 'yellow'];

    let colorsRussian = new Map([
        ['red', 'красный'],
        ['blue', 'синий'],
        ['green', 'зелёный'],
        ['purple', 'фиолетовый'],
        ['yellow', 'жёлтый']
    ]);

    let sizes = ['small', 'medium', 'large'];

    let names = ['Анастасия', 'Елена', 'Татьяна', 'Дарья', 'Мария', 'Алина'];

    let tasks = ['color', 'name', 'size'];
    let tasksRussian = new Map([
        ['color', 'цвет'],
        ['name', 'имя'],
        ['size', 'размер']
    ]);

    shuffleArray(tasks);
    let currentTaskIndex = 0;
    let selectedTask = tasks[currentTaskIndex];

    let matryoshkas = [];
    let score = 0;
    let finalScore = 0;
    let penalties = 0;

    let timeRound = 10;
    let timeLeft = timeRound;
    let timerInterval;

    let numMatryoshkas = 6;

    let mainMatryoshka;
    let currentMatryoshka;

    let mainMatryoshkaDiv = document.getElementById('main_matryoshka');
    let matryoshkasDiv = document.getElementById('matryoshkas');
    let wrongMatryoshkasDiv = document.getElementById('wrong_matryoshkas');
    let correctMatryoshkasDiv = document.getElementById('correct_matryoshkas');
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
        for (let i = 0; i < numMatryoshkas + 1; i++) {
            let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            let randomName = names[Math.floor(Math.random() * names.length)];
            matryoshkas.push({ color: randomColor, size: randomSize, name: randomName });
        }
    }

    function chooseMainMatryoshka() {
        let randomIndex = Math.floor(Math.random() * matryoshkas.length);
        mainMatryoshka = matryoshkas[randomIndex];
        matryoshkas.splice(randomIndex, 1);

        mainMatryoshkaDiv.innerHTML = '';

        mainMatryoshkaDiv.appendChild(createMatryoshkaDiv(mainMatryoshka));
    }

    function createMatryoshkas() {
        if (matryoshkas.length == 0) {

            setTimeout(function () {
                clearInterval(timerInterval);
                moveToNextLevel();
                return;
            }, 290)

        }
        matryoshkasDiv.innerHTML = '';

        let randomIndex = Math.floor(Math.random() * matryoshkas.length);
        currentMatryoshka = matryoshkas[randomIndex];
        let currentMatryoshkaDiv = createMatryoshkaDiv(currentMatryoshka);
        matryoshkas.splice(randomIndex, 1);
        matryoshkasDiv.appendChild(currentMatryoshkaDiv);
    }

    function createMatryoshkaDiv(matryoshka) {
        let matryoshkaDiv = document.createElement('div');
        matryoshkaDiv.classList.add('matryoshka');

        let nameElement = document.createElement('div');
        nameElement.textContent = matryoshka.name;
        nameElement.classList.add('matryoshka-name');

        let img = document.createElement('img');
        img.src = `../images/${matryoshka.color}_matryoshka.png`;
        img.classList.add(matryoshka.size);

        matryoshkaDiv.appendChild(nameElement);
        matryoshkaDiv.appendChild(img);

        return matryoshkaDiv;
    }

    function isMatch(matryoshka1, matryoshka2) {
        switch (selectedTask) {
            case 'color':
                return matryoshka1.color == matryoshka2.color;
            case 'name':
                return matryoshka1.name == matryoshka2.name;
            case 'size':
                return matryoshka1.size == matryoshka2.size;
            default:
                return false;
        }
    }

    function moveToNextLevel() {
        correctMatryoshkasDiv.innerHTML = '';
        wrongMatryoshkasDiv.innerHTML = '';
        calculateScore();
        finalScore += score;
        currentTaskIndex++;
        alert(`Поздравляем! Вы заработали очков: ${score}. Можем идти дальше!`);
        if (currentTaskIndex >= tasks.length) {
            finalScore = Math.round(finalScore * 1.5);
            if (finalScore > 0) {
                alert(`Поздравляем! Вы завершили уровень! За все этапы вы набрали очков: ${finalScore}`);
                localStorage.setItem('finalScoreLevel2', finalScore);
                localStorage.setItem('finalScoreLevel3', 0);
                window.location.href = "level3_rules.html";
            } else {
                alert(`К сожалению, вы набрали 0 очков. Начните всю игру заново!`);
                window.location.href = "level1_rules.html";
            }
        }
        numMatryoshkas += 3;
        timeRound += 5;
        selectedTask = tasks[currentTaskIndex];
        start();
    }

    function calculateScore() {
        let stageScore = timeLeft - penalties;
        if (stageScore < 0) stageScore = 0;
        score += stageScore;
    }

    document.addEventListener('keydown', (event) => {
        if (!currentMatryoshka) return;

        if (event.key == 'ArrowRight') {
            if (isMatch(currentMatryoshka, mainMatryoshka)) {
                moveMatryoshka(createMatryoshkaDiv(currentMatryoshka), correctMatryoshkasDiv);
                createMatryoshkas();
            } else {
                penalties++;
                alert('Эта матрёшка не совпадает с заданием! Нажмите влево.');
            }
        } else if (event.key == 'ArrowLeft') {
            if (!isMatch(currentMatryoshka, mainMatryoshka)) {
                moveMatryoshka(createMatryoshkaDiv(currentMatryoshka), wrongMatryoshkasDiv);
                createMatryoshkas();
            } else {
                penalties++;
                alert('Эта матрёшка совпадает с заданием! Нажмите Вправо.');
            }
        }
    });

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

    function moveMatryoshka(matryoshkaElementDiv, targetContainer) {
        targetContainer.innerHTML = '';
        matryoshkaElementDiv.classList.add('jump');
        targetContainer.appendChild(matryoshkaElementDiv);
    }

    function start() {
        score = 0;
        penalties = 0;
        generateMatryoshkas();
        chooseMainMatryoshka();
        taskDiv.textContent = `Критерий: ${tasksRussian.get(selectedTask)}`;
        createMatryoshkas();
        startTimer();
        window.scrollTo(0, document.body.scrollHeight);
    }

    start();
});
