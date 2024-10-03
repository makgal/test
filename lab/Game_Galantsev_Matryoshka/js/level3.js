document.addEventListener('DOMContentLoaded', () => {
    let draggedElement;
    let offsetX, offsetY;

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


    let changedParameterIndex = (currentTaskIndex + 1) % tasks.length;
    let changedParameter = tasks[changedParameterIndex];

    let score = 0;
    let finalScore = 0;
    let penalties = 0;

    let timeRound = 20;
    let timeLeft = timeRound;
    let timerInterval;

    let mainMatryoshka;
    let catchedMatryoshka;

    let numCorrectMatryoshka = 3;
    let stepMatryoshka = 3;

    let mainMatryoshkaDiv = document.getElementById('main_matryoshka');
    let matryoshkasDiv = document.getElementById('matryoshkas');
    let catchedMatryoshkaDiv = document.getElementById('catched_matryoshka');
    let taskDiv = document.getElementById('taskText');
    let timerDiv = document.getElementById('timer');


    let matryoshkas = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function chooseMainMatryoshka() {
        let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        let randomName = names[Math.floor(Math.random() * names.length)];

        mainMatryoshka = { size: randomSize, color: randomColor, name: randomName };

        mainMatryoshkaDiv.innerHTML = '';
        mainMatryoshkaDiv.appendChild(createMatryoshkaDiv(mainMatryoshka));
    }

    function generateMatryoshkas() {
        matryoshkas = [];

        for (let i = 0; i < numCorrectMatryoshka; i++) {
            if (selectedTask == "color") {
                let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                let randomName = names[Math.floor(Math.random() * names.length)];
                matryoshkas.push({ color: mainMatryoshka.color, size: randomSize, name: randomName });
            } else if (selectedTask == "size") {
                let randomColor = colors[Math.floor(Math.random() * colors.length)];
                let randomName = names[Math.floor(Math.random() * names.length)];
                matryoshkas.push({ color: randomColor, size: mainMatryoshka.size, name: randomName });
            } else if (selectedTask == "name") {
                let randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                let randomColor = colors[Math.floor(Math.random() * colors.length)];
                matryoshkas.push({ color: randomColor, size: randomSize, name: mainMatryoshka.name });
            }
        }
        for (let i = 0; i < numCorrectMatryoshka * 2; i++) {
            let randomSize, randomColor, randomName;

            while (true) {
                randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                if (selectedTask != 'size' || randomSize != mainMatryoshka.size) {
                    break;
                }
            }

            while (true) {
                randomColor = colors[Math.floor(Math.random() * colors.length)];
                if (selectedTask != 'color' || randomColor != mainMatryoshka.color) {
                    break;
                }
            }

            while (true) {
                randomName = names[Math.floor(Math.random() * names.length)];
                if (selectedTask != 'name' || randomName != mainMatryoshka.name) {
                    break;
                }
            }
            matryoshkas.push({ color: randomColor, size: randomSize, name: randomName });
        }
    }


    function createMatryoshkaDiv(matryoshkaData) {
        let matryoshkaDiv = document.createElement('div');
        matryoshkaDiv.classList.add('matryoshka');

        matryoshkaDiv.dataset.color = matryoshkaData.color;
        matryoshkaDiv.dataset.size = matryoshkaData.size;
        matryoshkaDiv.dataset.name = matryoshkaData.name;

        let nameElement = document.createElement('div');
        nameElement.textContent = matryoshkaData.name;
        nameElement.classList.add('matryoshka-name');

        let img = document.createElement('img');
        img.src = `../images/${matryoshkaData.color}_matryoshka.png`;
        img.classList.add(matryoshkaData.size);

        matryoshkaDiv.appendChild(nameElement);
        matryoshkaDiv.appendChild(img);

        return matryoshkaDiv;
    }


    function setMatryoshkaRandomCoords(matryoshkaDiv) {
        let img = matryoshkaDiv.querySelector('img');

        img.onload = function () {
            let containerRect = matryoshkasDiv.getBoundingClientRect();
            let containerWidth = containerRect.width;
            let containerHeight = containerRect.height;

            let matryoshkaWidth = img.offsetWidth;
            let matryoshkaHeight = img.offsetHeight;

            let randomX = matryoshkaWidth / 2 + Math.random() * (containerWidth - matryoshkaWidth);
            let randomY = matryoshkaHeight / 2 + Math.random() * (containerHeight - matryoshkaHeight);

            matryoshkaDiv.style.left = `${randomX}px`;
            matryoshkaDiv.style.top = `${randomY}px`;
        };
    }

    function createMatryoshkaOnField(matryoshkaDiv) {
        matryoshkaDiv.addEventListener('mousedown', startDrag);
        matryoshkaDiv.style.position = 'absolute';

        let moveX, moveY;
        getRandom();

        function getRandom() {
            moveX = Math.random() * stepMatryoshka * 2 - stepMatryoshka;
            moveY = Math.random() * stepMatryoshka * 2 - stepMatryoshka;
        }

        function randomMove() {
            let rect = matryoshkaDiv.getBoundingClientRect();
            let containerRect = matryoshkasDiv.getBoundingClientRect();

            let newX = parseInt(matryoshkaDiv.style.left) + moveX;
            let newY = parseInt(matryoshkaDiv.style.top) + moveY;

            if (newX < rect.width / 2) {
                newX = rect.width / 2;
                moveX = -moveX;
            } else if (newX + rect.width / 2 > containerRect.width) {
                newX = containerRect.width - rect.width / 2;
                moveX = -moveX;
            }

            if (newY < rect.height / 2) {
                newY = rect.height / 2;
                moveY = -moveY;
            } else if (newY + rect.height / 2 > containerRect.height) {
                newY = containerRect.height - rect.height / 2;
                moveY = -moveY;
            }

            matryoshkaDiv.style.left = `${newX}px`;
            matryoshkaDiv.style.top = `${newY}px`;
        }

        let moveInterval = setInterval(randomMove, 20);

        matryoshkaDiv.addEventListener('mousedown', function () {
            clearInterval(moveInterval);
        });

        matryoshkaDiv.addEventListener('mouseover', function () {
            clearInterval(moveInterval);
            matryoshkaDiv.classList.add('jump');
        })

        matryoshkaDiv.addEventListener('mouseout', function () {
            matryoshkaDiv.classList.remove('jump');
            getRandom();
            moveInterval = setInterval(randomMove, 20);
        })

    }

    function initializeMatryoshkas() {
        matryoshkasDiv.innerHTML = '';

        matryoshkas.forEach(matryoshka => {
            let currentMatryoshkaDiv = createMatryoshkaDiv(matryoshka);
            matryoshkasDiv.appendChild(currentMatryoshkaDiv);

            setMatryoshkaRandomCoords(currentMatryoshkaDiv);
            createMatryoshkaOnField(currentMatryoshkaDiv)
        });
    }

    function checkCatch(matryoshka1, matryoshka2) {
        let matryoshka2Data = {
            color: matryoshka2.dataset.color,
            name: matryoshka2.dataset.name,
            size: matryoshka2.dataset.size
        };

        switch (selectedTask) {
            case 'color':
                return matryoshka1.color == matryoshka2Data.color;
            case 'name':
                return matryoshka1.name == matryoshka2Data.name;
            case 'size':
                return matryoshka1.size == matryoshka2Data.size;
            default:
                return false;
        }
    }

    function startDrag(e) {
        if (e.button != 0) return;
        e.preventDefault();
        draggedElement = e.target.closest('.matryoshka');
        let draggedElementRect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - draggedElementRect.left - draggedElementRect.width / 2;
        offsetY = e.clientY - draggedElementRect.top - draggedElementRect.height / 2;

        draggedElement.style.zIndex = '100';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

    }

    function drag(e) {
        e.preventDefault();
        if (draggedElement) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            draggedElement.style.position = 'fixed';
            draggedElement.style.left = `${newLeft}px`;
            draggedElement.style.top = `${newTop}px`;
        }
    }

    function wheelMatryoshka(e) {
        e.preventDefault();
        if (catchedMatryoshka) {
            let currentColor = catchedMatryoshka.color;
            let currentSize = catchedMatryoshka.size;
            let currentName = catchedMatryoshka.name;

            if (changedParameter == 'color') {
                let currentColorIndex = colors.indexOf(currentColor);
                let newColorIndex = (currentColorIndex + (e.deltaY < 0 ? 1 : -1) + colors.length) % colors.length;
                catchedMatryoshka.color = colors[newColorIndex];

            } else if (changedParameter == 'name') {
                let currentNameIndex = names.indexOf(currentName);
                let newNameIndex = (currentNameIndex + (e.deltaY < 0 ? 1 : -1) + names.length) % names.length;
                catchedMatryoshka.name = names[newNameIndex];

            } else if (changedParameter == 'size') {
                let currentSizeIndex = sizes.indexOf(currentSize);
                let newSizeIndex = (currentSizeIndex + (e.deltaY < 0 ? 1 : -1) + sizes.length) % sizes.length;
                catchedMatryoshka.size = sizes[newSizeIndex];
            }
            catchedMatryoshkaDiv.innerHTML = '';
            let currentMatryoshkaDiv = createMatryoshkaDiv(catchedMatryoshka);

            catchedMatryoshkaDiv.appendChild(currentMatryoshkaDiv);
            currentMatryoshkaDiv.addEventListener('wheel', wheelMatryoshka);
            currentMatryoshkaDiv.addEventListener('dblclick', dblClickMatryoshka);

        }
    }


    function dblClickMatryoshka(e) {
        if (catchedMatryoshka) {
            let isChangedParameterOk = false;
            if (changedParameter == 'color') {
                if (catchedMatryoshka.color == mainMatryoshka.color) {
                    isChangedParameterOk = true;
                }

            } else if (changedParameter == 'name') {

                if (catchedMatryoshka.name == mainMatryoshka.name) {
                    isChangedParameterOk = true;
                }

            } else if (changedParameter == 'size') {
                if (catchedMatryoshka.size == mainMatryoshka.size) {
                    isChangedParameterOk = true;
                }
            }
            if (isChangedParameterOk) {
                catchedMatryoshkaDiv.innerHTML = '';
                let currentMatryoshkaDiv = createMatryoshkaDiv(catchedMatryoshka);
                currentMatryoshkaDiv.classList.add('fade');
                catchedMatryoshkaDiv.appendChild(currentMatryoshkaDiv);
                setTimeout(() =>
                    catchedMatryoshkaDiv.innerHTML = ''
                    , 290)
                catchedMatryoshka = null;
                checkWinCondition();
            } else {
                penalties++;
                alert("Неправильно выбран второй параметр!");
            }
        }
    }

    function stopDrag(e) {
        if (draggedElement) {
            let catchedMatryoshkaDivRect = catchedMatryoshkaDiv.getBoundingClientRect();
            let matryoshkasDivRect = matryoshkasDiv.getBoundingClientRect();

            if (
                e.clientX >= catchedMatryoshkaDivRect.left &&
                e.clientX <= catchedMatryoshkaDivRect.right &&
                e.clientY >= catchedMatryoshkaDivRect.top &&
                e.clientY <= catchedMatryoshkaDivRect.bottom
            ) {
                if (!catchedMatryoshka) {
                    if (checkCatch(mainMatryoshka, draggedElement)) {
                        matryoshkasDiv.removeChild(draggedElement);
                        catchedMatryoshkaDiv.innerHTML = '';
                        draggedElement.removeEventListener('mousedown', startDrag);
                        draggedElement.removeEventListener('mousemove', drag);
                        draggedElement.removeEventListener('mouseup', stopDrag);
                        draggedElement.style.position = 'absolute';
                        draggedElement.style.top = '50%';
                        draggedElement.style.left = '50%';
                        catchedMatryoshka = { color: draggedElement.dataset.color, name: draggedElement.dataset.name, size: draggedElement.dataset.size };

                        let matryoshkaIndex = matryoshkas.findIndex(matryoshka =>
                            matryoshka.color == catchedMatryoshka.color &&
                            matryoshka.name == catchedMatryoshka.name &&
                            matryoshka.size == catchedMatryoshka.size
                        );
                        if (matryoshkaIndex !== -1) {
                            matryoshkas.splice(matryoshkaIndex, 1);
                        }

                        let currentMatryoshkaDiv = createMatryoshkaDiv(catchedMatryoshka);
                        currentMatryoshkaDiv.classList.add('jump');
                        catchedMatryoshkaDiv.appendChild(currentMatryoshkaDiv);

                        currentMatryoshkaDiv.addEventListener('wheel', wheelMatryoshka);
                        currentMatryoshkaDiv.addEventListener('dblclick', dblClickMatryoshka);
                    } else {
                        penalties++;
                        alert('У матрёшек не совпадает параметр!');
                        let containerRect = matryoshkasDiv.getBoundingClientRect();
                        let containerWidth = containerRect.width;
                        let containerHeight = containerRect.height;

                        let matryoshkaWidth = draggedElement.offsetWidth;
                        let matryoshkaHeight = draggedElement.offsetHeight;

                        let randomX = matryoshkaWidth / 2 + Math.random() * (containerWidth - matryoshkaWidth);
                        let randomY = matryoshkaHeight / 2 + Math.random() * (containerHeight - matryoshkaHeight);

                        draggedElement.style.position = 'absolute';
                        draggedElement.style.left = `${randomX}px`;
                        draggedElement.style.top = `${randomY}px`;

                        matryoshkasDiv.appendChild(draggedElement);
                    }
                } else {
                    alert("Место занято!");
                    let containerRect = matryoshkasDiv.getBoundingClientRect();
                    let containerWidth = containerRect.width;
                    let containerHeight = containerRect.height;

                    let matryoshkaWidth = draggedElement.offsetWidth;
                    let matryoshkaHeight = draggedElement.offsetHeight;

                    let randomX = matryoshkaWidth / 2 + Math.random() * (containerWidth - matryoshkaWidth);
                    let randomY = matryoshkaHeight / 2 + Math.random() * (containerHeight - matryoshkaHeight);

                    draggedElement.style.position = 'absolute';
                    draggedElement.style.left = `${randomX}px`;
                    draggedElement.style.top = `${randomY}px`;

                    matryoshkasDiv.appendChild(draggedElement);
                }
            } else if (
                e.clientX >= matryoshkasDivRect.left &&
                e.clientX <= matryoshkasDivRect.right &&
                e.clientY >= matryoshkasDivRect.top &&
                e.clientY <= matryoshkasDivRect.bottom
            ) {
                let container = document.getElementById('matryoshkas');
                let containerRect = container.getBoundingClientRect();
                createMatryoshkaOnField(draggedElement);
                matryoshkasDiv.appendChild(draggedElement);
                draggedElement.style.left = (e.clientX - offsetX - containerRect.left) + 'px';
                draggedElement.style.top = (e.clientY - offsetY - containerRect.top) + 'px';
            } else {
                createMatryoshkaOnField(draggedElement);
                setMatryoshkaRandomCoords(draggedElement);
            }
            draggedElement.style.zIndex = '';
            draggedElement = null;
        }
    }

    function checkWinCondition() {
        let remainingMatryoshkas = Array.from(matryoshkasDiv.children).filter(child => {
            if (selectedTask == 'color') {
                return child.dataset.color == mainMatryoshka.color;
            } else if (selectedTask == 'name') {
                return child.dataset.name == mainMatryoshka.name;
            } else if (selectedTask == 'size') {
                return child.dataset.size == mainMatryoshka.size;
            }
        });
        if (remainingMatryoshkas.length == 0) {
            moveToNextLevel();
        }
    }

    function moveToNextLevel() {
        mainMatryoshkaDiv.innerHTML = '';
        catchedMatryoshkaDiv.innerHTML = '';
        matryoshkasDiv.innerHTML = '';
        calculateScore();
        finalScore += score;
        currentTaskIndex++;
        alert(`Поздравляем! Вы заработали очков: ${score}. Можем идти дальше!`);
        if (currentTaskIndex >= tasks.length) {
            finalScore *= 2;

            if (finalScore > 0) {
                alert(`Поздравляем! Вы завершили уровень! За все этапы вы набрали очков: ${finalScore}`);
                localStorage.setItem('finalScoreLevel3', finalScore);
                window.location.href = "record_table.html";
            } else {
                alert(`К сожалению, вы набрали 0 очков. Начните всю игру заново!`);
                window.location.href = "level1_rules.html";
            }
        }

        selectedTask = tasks[currentTaskIndex];
        changedParameterIndex = (currentTaskIndex + 1) % tasks.length;
        changedParameter = tasks[changedParameterIndex];
        stepMatryoshka += 3;
        numCorrectMatryoshka += 1;
        timeRound += 10;
        start();
    }

    function calculateScore() {
        let stageScore = timeLeft - penalties;
        if (stageScore < 0) stageScore = 0;
        score += stageScore;
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

    function start() {
        score = 0;
        penalties = 0;
        startTimer();
        chooseMainMatryoshka();
        generateMatryoshkas();
        taskDiv.textContent = `Основной параметр: ${tasksRussian.get(selectedTask)}\r\nИзменяемый параметр: ${tasksRussian.get(changedParameter)}`;
        initializeMatryoshkas();
        window.scrollTo(0, document.body.scrollHeight);
    }

    start();
});