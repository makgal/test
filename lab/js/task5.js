document.addEventListener('DOMContentLoaded', () => {
    let draggedElement = null;
    let offsetX = 0, offsetY = 0;
    let isMouseActive = false;
    let isRotationActive = false;
    let partRotationDict = {};

    function randomizePartsPosition() {
        let container = document.getElementById('container');
        let containerRect = container.getBoundingClientRect();

        document.querySelectorAll('.part').forEach(part => {
            let partRect = part.getBoundingClientRect();
            let maxX = containerRect.width - partRect.width;
            let maxY = containerRect.height - partRect.height;

            let randomX = Math.floor(Math.random() * maxX);
            let randomY = Math.floor(Math.random() * maxY);
            let randomRotation = Math.floor(Math.random() * 4) * 90;

            partRotationDict[part.id] = randomRotation;

            part.style.left = `${randomX}px`;
            part.style.top = `${randomY}px`;
            part.style.transform = `rotate(${randomRotation}deg)`;
        });
    }

    function startDrag(e) {
        if (!isRotationActive) {
            if (e.button != 0) return;
            e.preventDefault();
            isMouseActive = true;
            draggedElement = e.target;
            let container = document.getElementById('container');
            let containerRect = container.getBoundingClientRect();

            offsetX = e.clientX - containerRect.left - parseInt(draggedElement.style.left);
            offsetY = e.clientY - containerRect.top - parseInt(draggedElement.style.top);
        }
    }

    function drag(e) {
        e.preventDefault();
        if (draggedElement) {
            let container = document.getElementById('container');
            let containerRect = container.getBoundingClientRect();
            let rect = draggedElement.getBoundingClientRect();

            let newLeft = e.clientX - offsetX - containerRect.left;
            let newTop = e.clientY - offsetY - containerRect.top;

            let rotation = partRotationDict[draggedElement.id];

            let realLeft = newLeft;
            let realTop = newTop;

            if (Math.abs(rotation) == 90 || Math.abs(rotation) == 270) {
                let centerX = newLeft + rect.height / 2;
                let centerY = newTop + rect.width / 2;
                realLeft = centerX - rect.width / 2;
                realTop = centerY - rect.height / 2;
            }

            if (realLeft < 0) {
                newLeft -= realLeft;
            }
            if (realLeft + rect.width > containerRect.width) {
                newLeft -= realLeft + rect.width - containerRect.width;
            }
            if (realTop < 0) {
                newTop -= realTop;
            }
            if (realTop + rect.height > containerRect.height) {
                newTop -= realTop + rect.height - containerRect.height;
            }
            draggedElement.style.left = `${newLeft}px`;
            draggedElement.style.top = `${newTop}px`;
        }
    }

    function stopDrag() {
        if (draggedElement) {
            draggedElement = null;
            checkCompletion();
        }
        isMouseActive = false;
    }

    function rotatePart(e) {
        e.preventDefault();
        if (!isMouseActive && !isRotationActive) {
            isRotationActive = true;
            let element = e.target;
            let currentRotation = partRotationDict[element.id];
            let newRotation = currentRotation;
            if (e.deltaY > 0) {
                newRotation = (currentRotation + 90) % 360;
            } else {
                newRotation = (currentRotation - 90) % 360;
            }
            newRotation = (Math.ceil(newRotation / 90) * 90) % 360;
            partRotationDict[element.id] = newRotation;
            element.style.transform = `rotate(${newRotation}deg)`;
        }
        isRotationActive = false;
    }

    function checkCompletion() {
        let correct = true;
        let basePart = document.getElementById('part1');
        let baseRect = basePart.getBoundingClientRect();

        document.querySelectorAll('.part').forEach(part => {
            let rect = part.getBoundingClientRect();
            let correctPosition = getCorrectPosition(part.id, baseRect);
            let isCorrectPosition = isPositionCorrect(rect, correctPosition);
            let currentRotation = partRotationDict[part.id];
            let isCorrectRotation = currentRotation == correctPosition.rotation;

            if (!(isCorrectPosition && isCorrectRotation)) correct = false;
        });

        if (correct) {
            triggerSuccessAnimation();
        }
    }

    function getCorrectPosition(id, baseRect) {
        let relativePositions = {
            'part1': { left: 0, top: 0, rotation: 0 },
            'part2': { left: -31, top: 238, rotation: 0 },
            'part3': { left: 50, top: -19, rotation: 0 },
            'part4': { left: 35, top: -49, rotation: 0 },
            'part5': { left: 65, top: 118, rotation: 0 },
            'part6': { left: 49, top: 210, rotation: 0 }
        };

        let relativePos = relativePositions[id];
        return {
            left: baseRect.left + relativePos.left,
            top: baseRect.top + relativePos.top,
            rotation: relativePos.rotation
        };
    }

    function isPositionCorrect(rect, correctPos) {
        return Math.abs(rect.left - correctPos.left) < 7 && Math.abs(rect.top - correctPos.top) < 7;
    }

    function triggerSuccessAnimation() {
        document.querySelectorAll('.part').forEach(part => {
            part.classList.add('success-animation');
        });
        document.querySelector('.text_area').innerHTML = "Успех!";
    }

    document.querySelectorAll('.part').forEach(part => {
        part.addEventListener('mousedown', startDrag);
        part.addEventListener('wheel', rotatePart);
        part.addEventListener('mousemove', drag);
        part.addEventListener('mouseup', stopDrag);
    });

    randomizePartsPosition();
});