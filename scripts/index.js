/* eslint-disable no-undef */
// porque estan vinculados por el index.html

/**
 *  funcion para sacar las fichas que tiene el usuario,
 *  si no hay una cookie de las fichas, devolvera 0
 * @returns fichas del usuario
 */
function getUserFichas() {
    const fichas = getCookie('fichasNumber');
    return fichas === '' ? 0 : +fichas;
}

/**
 * Funcion para sacudir un elemento html, y escribir un mensaje de error
 * @param {*} element el elemento a sacudir
 * @param {*} div donde se mostrara el mensaje
 * @param {*} errorMessatge el string del mensaje
 */
function shakeElement(element, div, errorMessatge) {
    setTimeout(() => {
        element.style.animation = 'shake 0.5s';
        element.value = '';
        div.innerHTML = errorMessatge;
    }, 200);
}

// El div de posision absoluta donde se mostraran las cookies del usuario
const outputFichasUser = document.getElementById('chips');
outputFichasUser.innerHTML = `Tienes ${getUserFichas()} fichas`;

const addChip = document.getElementById('add-chips');
/**
 * Capturar el evento input del apartado comprar para prevenir errores y luego sacudir el input
 */
addChip.addEventListener('input', () => {
    addChip.style.removeProperty('animation');
    const chipDiv = document.getElementById('add-chip-error');
    chipDiv.innerHTML = '';
    if (addChip.value < 0) {
        shakeElement(addChip, chipDiv, '<p>No puedes introducir fichas negativas</p>');
    }
    if (addChip.value % 1 !== 0) {
        shakeElement(addChip, chipDiv, '<p>No puedes introducir fichas con decimales</p>');
    }
});

/**
 * Capturar el evento click del boton "+" para añadir las fichas que habia escrito el usuario
 * si no ha escrito nada, se sumara undifinded a las fichas que ya tenia el usuario y no pasara nada
 */
document.getElementById('add-chips-btn').addEventListener('click', () => {
    const inputFichas = document.getElementById('add-chips');
    setCookie('fichasNumber', (+inputFichas.value + getUserFichas()), 30);
    outputFichasUser.innerHTML = `Tienes ${getUserFichas()} fichas`;
    inputFichas.value = null;
});

// Inicializar todos los elementos html de la parte comprar
const addBet = document.getElementById('bet');
const betNumber = document.getElementById('bet-number');
const betType = document.getElementById('bet-type');
const betNumberDiv = document.getElementById('bet-number-div');
const betBtn = document.getElementById('bet-btn');
const betDiv = document.getElementById('bet-error');
const ruleta = document.getElementById('ruleta');

/**
 * Control de errores del input 'bet' (Cantidad de fichas)
 */
addBet.addEventListener('input', () => {
    addBet.style.removeProperty('animation');
    betBtn.style.removeProperty('animation');
    betDiv.innerHTML = '';
    if (addBet.value < 0) {
        shakeElement(addBet, betDiv, '<p>No puede apostar fichas negativas</p>');
    }
    if (addBet.value % 1 !== 0) {
        shakeElement(addBet, betDiv, '<p>No puedes introducir fichas con decimales</p>');
    }
    if (addBet.value > getUserFichas()) {
        shakeElement(addBet, betDiv, '<p>No tienes suficientes fichas</p>');
    }
});

/**
 * Desplegar el div del input de numero al que apostar al elegir el tipo al que apostar
 */
betType.addEventListener('click', () => {
    betBtn.style.removeProperty('animation');
    betDiv.innerHTML = '';
    betNumber.value = '';
    if (betType.value === 'none') {
        betNumberDiv.style.display = 'none';
    } else if (betType.value === 'par') {
        betNumberDiv.style.display = 'inline';
    } else {
        betNumberDiv.style.display = 'inline';
    }
});

/**
 * Control errores del input 'bet-number' (EL input de elegir el numero al que apostar)
 */
betNumber.addEventListener('input', () => {
    betNumber.style.removeProperty('animation');
    betDiv.innerHTML = '';
    if (betNumber.value < 0) {
        shakeElement(betNumber, betDiv, '<p>No puedes apostar a un numero negativo</p>');
    }
    if (betNumber.value % 1 !== 0) {
        shakeElement(betNumber, betDiv, '<p>No puedes apostar a un numero con decimales</p>');
    }
    if (betNumber.value > 36) {
        shakeElement(betNumber, betDiv, '<p>Solo puedes apostar a un numero entre 0 y 36</p>');
    }
});

/**
 * Mirar si has ganado una apuesta simple (Solo a un tipo)
 * @param {*} winner el numero ganador
 * @returns si ha ganado devuelve la cantidad que ha ganado y si ha perdido devuelve 'false'
 */
function simpleBet(winner) {
    const quote = 1.5;
    const winValue = parseInt(+addBet.value * +quote, 10);
    if (betType.value === 'par') {
        if (winner % 2 === 0) {
            setCookie('fichasNumber', (getUserFichas() + winValue), 30);
            return winValue;
        }
    } else if (winner % 2 !== 0) {
        setCookie('fichasNumber', (getUserFichas() + winValue), 30);
        return winValue;
    }
    return false;
}

/**
 * Mirar si ha ganado una apuesta a un numero
 * @param {*} winner el numero ganador
 * @returns si ha ganado devuelve la cantidad que ha ganado y si ha perdido devuelve 'false'
 */
function numberBet(winner) {
    const winValue = parseInt(+addBet.value * 2, 10);
    if (winner === +betNumber.value) {
        setCookie('fichasNumber', (getUserFichas() + winValue), 30);
        return winValue;
    }
    return false;
}

/**
 * Numero random entre dos valores
 * @param {*} min el minimo
 * @param {*} max el maximo
 * @returns el numero
 */
function randomIntFromInterval(min, max) {
    return (Math.floor(Math.random() * (max - min + 1) + min));
}

/**
 * Inicializar el Map de los valores de la ruleta
 * @key son a cuantas celdas a la izquierda esta del 0
 * @value el numero al que pertenece la zelda
 */
const ganador = new Map();
ganador.set(0, 0);
ganador.set(1, 26);
ganador.set(2, 3);
ganador.set(3, 35);
ganador.set(4, 12);
ganador.set(5, 28);
ganador.set(6, 7);
ganador.set(7, 29);
ganador.set(8, 18);
ganador.set(9, 22);
ganador.set(10, 9);
ganador.set(11, 31);
ganador.set(12, 14);
ganador.set(13, 20);
ganador.set(14, 1);
ganador.set(15, 33);
ganador.set(16, 16);
ganador.set(17, 24);
ganador.set(18, 5);
ganador.set(19, 10);
ganador.set(20, 23);
ganador.set(21, 8);
ganador.set(22, 30);
ganador.set(23, 11);
ganador.set(24, 36);
ganador.set(25, 13);
ganador.set(26, 27);
ganador.set(27, 6);
ganador.set(28, 34);
ganador.set(29, 17);
ganador.set(30, 25);
ganador.set(31, 2);
ganador.set(32, 21);
ganador.set(33, 4);
ganador.set(34, 19);
ganador.set(35, 15);
ganador.set(36, 32);

// Para poder cambiar la variable en css
const css = document.querySelector(':root');

/**
 * Depende del test devuelve el numero ganador y hace la animacion de la ruleta
 * @returns el numero ganador
 */
function getWinnerNumber() {
    const degresSplit36 = 360 / 37; // Cuantos grados ocupa cada zelda
    let random = 0;
    let randomString = 0;
    const test = document.getElementById('test');
    if (test.value === 'win') {
        if (betNumber.value === '') {
            if (betType.value === 'par') {
                do {
                    random = randomIntFromInterval(3600, 7200);
                    randomString = `${random}deg`;
                    random %= 360;
                    random = Math.trunc(random / degresSplit36);
                } while (ganador.get(random) % 2 !== 0);
            } else {
                do {
                    random = randomIntFromInterval(3600, 7200);
                    randomString = `${random}deg`;
                    random %= 360;
                    random = Math.trunc(random / degresSplit36);
                } while (ganador.get(random) % 2 === 0);
            }
        } else {
            do {
                random = randomIntFromInterval(3600, 7200);
                randomString = `${random}deg`;
                random %= 360;
                random = Math.trunc(random / degresSplit36);
            } while (ganador.get(random) !== +betNumber.value);
        }
    } else if (test.value === 'lose') {
        if (betNumber.value === '') {
            if (betType.value === 'par') {
                do {
                    random = randomIntFromInterval(3600, 7200);
                    randomString = `${random}deg`;
                    random %= 360;
                    random = Math.trunc(random / degresSplit36);
                } while (ganador.get(random) % 2 === 0);
            } else {
                do {
                    random = randomIntFromInterval(3600, 7200);
                    randomString = `${random}deg`;
                    random %= 360;
                    random = Math.trunc(random / degresSplit36);
                } while (ganador.get(random) % 2 !== 0);
            }
        } else {
            do {
                random = randomIntFromInterval(3600, 7200);
                randomString = `${random}deg`;
                random %= 360;
                random = Math.trunc(random / degresSplit36);
            } while (ganador.get(random) === +betNumber.value);
        }
    } else {
        random = randomIntFromInterval(3600, 7200); // Minimo 10 vueltas, maximo 20 vueltas
        randomString = `${random}deg`;
        random %= 360; // El resto de la ultima vuelta
        random = Math.trunc(random / degresSplit36); // A cuantas zeldas esta a la izquierda del 0
    }
    css.style.setProperty('--deg', randomString);
    ruleta.style.animation = ' spin 10s 1 ease-in-out normal forwards';
    return ganador.get(random);
}

/**
 * Apostar
 * Los timeouts son para que se ejecuten bien las animaciones
 */
betBtn.addEventListener('click', () => {
    betDiv.innerHTML = '';
    ruleta.removeAttribute('style');
    setTimeout(() => {
        betBtn.style.removeProperty('animation');
        if (betType.value !== 'none' && addBet.value > 19) {
            if (addBet.value <= getUserFichas()) {
                if (betNumber.value === '') {
                    const winner = getWinnerNumber();
                    const whichType = winner % 2 === 0 ? 'par' : 'impar';
                    setCookie('fichasNumber', (getUserFichas() - +addBet.value), 30);
                    const isWin = simpleBet(winner);
                    betBtn.disabled = true;
                    setTimeout(() => {
                        if (isWin) {
                            betDiv.innerHTML = `${winner}, ${whichType}<br>Has ganado ${isWin} fichas`;
                        } else {
                            betDiv.innerHTML = `${winner}, ${whichType}<br>Has perdido`;
                        }
                        outputFichasUser.innerHTML = `Tienes ${getUserFichas()} fichas`;
                        betBtn.disabled = false;
                    }, 10000);
                } else if (betNumber.value % 2 !== 0 && betType.value === 'par') {
                    shakeElement(betNumber, betDiv, '<p>El numero debe ser un par</p>');
                } else if (betNumber.value % 2 === 0 && betType.value === 'impar') {
                    shakeElement(betNumber, betDiv, '<p>El numero debe ser un impar</p>');
                } else {
                    const winner = getWinnerNumber();
                    const whichType = winner % 2 === 0 ? 'par' : 'impar';
                    setCookie('fichasNumber', (getUserFichas() - +addBet.value), 30);
                    const isWinNumber = numberBet(winner);
                    betBtn.disabled = true;
                    setTimeout(() => {
                        if (isWinNumber) {
                            betDiv.innerHTML = `${winner}, ${whichType}<br>Has ganado ${isWinNumber} fichas`;
                        } else {
                            betDiv.innerHTML = `${winner}, ${whichType}<br>Has perdido`;
                        }
                        outputFichasUser.innerHTML = `Tienes ${getUserFichas()} fichas`;
                        betBtn.disabled = false;
                    }, 10000);
                }
            } else {
                shakeElement(betBtn, betDiv, '<p>No tienes suficientes fichas</p>');
            }
        } else {
            shakeElement(betBtn, betDiv, '<p>Debes apostar almenos 20 ficha y apostar a par o impar</p>');
        }
    }, 300);
});
