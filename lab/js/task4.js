document.addEventListener('DOMContentLoaded', () => {
    let latinPhrases = [
        "Consuetudo est altera natura",
        "Nota bene",
        "Nulla calamitas sola",
        "Per aspera ad astra",
        "Scientia potentia est",
        "Vita brevis, ars longa",
        "Volens - nolens",
        "Historia est magistra vita",
        "Dum spiro, spero",
        "Terra incognita",
        "Sina era est studio",
        "Cogito ergo sum",
        "Errare humanum est",
        "Mens sana in corpore sano",
        "Finis coronat opus"
    ];

    let translations = [
        "Привычка - вторая натура",
        "Заметьте хорошо!",
        "Беда не приходит одна",
        "Через тернии к звёздам",
        "Знание - сила",
        "Жизнь коротка, искусство - вечно",
        "Волей - неволей",
        "История - учительница жизни",
        "Пока дышу - надеюсь",
        "Неизвестная земля",
        "Без гнева и пристрастия",
        "Мыслю, следовательно существую",
        "Человеку свойственно ошибаться",
        "В здоровом теле здоровый дух",
        "Конец - делу венец"
    ];

    let shuffledPhrases = [];
    let shuffledTranslations = [];
    shufflePhrases();
    let clickCount = 0;
    let phraseIndex = 0;
    let isRecolored = false;

    document.getElementById('generateButton').addEventListener('click', function () {
        if (phraseIndex < shuffledPhrases.length) {
            clickCount++;
            createPhrase(phraseIndex, shuffledPhrases[phraseIndex], shuffledTranslations[phraseIndex]);
            phraseIndex++;
            window.scrollTo(0, document.body.scrollHeight);
        } else {
            alert("Фразы закончились");
        }
    });

    document.getElementById('recolorButton').addEventListener('click', function () {
        isRecolored = !isRecolored;
        if (isRecolored) {
            let evenStrings = document.querySelectorAll('#rand p:nth-child(even)');
            evenStrings.forEach(p => {
                p.style.fontWeight = 'bold';
            });
        } else {
            let evenStrings = document.querySelectorAll('#rand p:nth-child(even)');
            evenStrings.forEach(p => {
                p.style.fontWeight = 'normal';
            });
        }

    });

    function shufflePhrases() {
        shuffledPhrases = latinPhrases;
        shuffledTranslations = translations;

        for (let i = shuffledPhrases.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffledPhrases[i], shuffledPhrases[j]] = [shuffledPhrases[j], shuffledPhrases[i]];
            [shuffledTranslations[i], shuffledTranslations[j]] = [shuffledTranslations[j], shuffledTranslations[i]];
        }
    }

    function createPhrase(index, latin, translation) {
        let p = document.createElement('p');
        let phraseIndex = document.createElement('span');
        let latinText = document.createElement('span');
        let translationText = document.createElement('span');

        phraseIndex.textContent = `n=${index}   `;
        phraseIndex.style.textDecoration = 'underline';

        latinText.textContent = `"${latin}"   `;
        latinText.style.fontStyle = 'italic';

        translationText.textContent = `"${translation}"`;

        p.appendChild(phraseIndex);
        p.appendChild(latinText);
        p.appendChild(translationText);

        if (clickCount % 2 == 0) {
            p.classList.add('class1');
        } else {
            p.classList.add('class2');
        }

        if (index % 2 == 1 && isRecolored) {
            p.style.fontWeight = 'bold';
        } else if (index % 2 == 1 && !isRecolored) {
            p.style.fontWeight = 'normal';
        }

        document.getElementById('rand').appendChild(p);
    }
});
