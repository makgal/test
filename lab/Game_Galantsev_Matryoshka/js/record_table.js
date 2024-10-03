document.addEventListener('DOMContentLoaded', () => {
    let jsonUrl = 'http://127.0.0.1:5000/json/record_table.json';

    let scoreLevel1 = parseInt(localStorage.getItem('finalScoreLevel1')) || 0;
    let scoreLevel2 = parseInt(localStorage.getItem('finalScoreLevel2')) || 0;
    let scoreLevel3 = parseInt(localStorage.getItem('finalScoreLevel3')) || 0;
    let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    let currentUser = localStorage.getItem('username');

    function calculateTotalScore() {
        let totalScore;
        if (scoreLevel1 == 0
            || scoreLevel2 == 0
            || scoreLevel3 == 0) {
            totalScore = 0;
        } else {
            totalScore = scoreLevel1 + scoreLevel2 + scoreLevel3;
        }
        return totalScore;
    }

    let totalScore = calculateTotalScore();
    let scoreMessage = document.querySelector('.score_message');

    if (totalScore != 0) {
        if (totalScore > bestScore) {
            if (bestScore > 0) {
                scoreMessage.textContent = `Вы набрали ${totalScore} очков и побили свой старый рекорд (${bestScore} очков)!`;
            } else {
                scoreMessage.textContent = `Вы набрали ${totalScore} очков и установили свой рекорд!`;
            }
            bestScore = totalScore;
            localStorage.setItem('bestScore', bestScore);
        } else {
            scoreMessage.textContent = `Вы набрали ${totalScore} очков.\r\nВаш рекорд: ${bestScore} очков`;
        }

        localStorage.setItem('finalScoreLevel1', 0);
        localStorage.setItem('finalScoreLevel2', 0);
        localStorage.setItem('finalScoreLevel3', 0);
    } else {
        scoreMessage.textContent = `Ваш рекорд: ${bestScore} очков`;
    }

    function loadScores() {
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let tableBody = document.querySelector('#score_table tbody');

                tableBody.innerHTML = '';

                data.sort((a, b) => b.bestScore - a.bestScore);

                data.forEach(record => {
                    let row = document.createElement('tr');
                    let usernameCell = document.createElement('td');
                    let scoreCell = document.createElement('td');

                    usernameCell.textContent = record.username;
                    scoreCell.textContent = record.bestScore;
                    if (record.username == currentUser) {
                        row.style.backgroundColor = 'white'; 
                        row.style.fontWeight = 'bold';
                        row.style.color = 'black';
                        if (!bestScore
                            || record.bestScore > bestScore) {
                                localStorage.setItem('bestScore', record.bestScore);
                                bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
                                scoreMessage.textContent = `Ваш рекорд: ${bestScore} очков`;
                        }
                    }

                    row.appendChild(usernameCell);
                    row.appendChild(scoreCell);

                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }

    function saveBestScoreToJson(bestScore) {
        if (!currentUser) {
            console.error("Имя пользователя не найдено!");
            return;
        }

        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let existingRecord = data.find(record => record.username == currentUser);

                if (existingRecord) {
                    if (bestScore > existingRecord.bestScore) {
                        existingRecord.bestScore = bestScore;
                    }
                } else {
                    data.push({ username: currentUser, bestScore: bestScore }); 
                }

                return fetch(jsonUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка при сохранении результата! Статус: ${response.status}`);
                }

                loadScores();
            })
            .catch(error => {
                console.error('Ошибка при сохранении результата:', error);
            });
    }
    
    saveBestScoreToJson(bestScore);
    loadScores();
});