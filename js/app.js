import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);

// Create the Game Board
function initBoard() {
    // Get the div for the game board
    let board = document.getElementById("game-board");

    // We have 6 guesses for each party
    // We create one row for each guess
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        // Create a div for the row
        let row = document.createElement("div");
        // Add a className to the div
        row.className = "letter-row";

        // The game is only for words with 5 letters
        // So, we have to create 5 boxes for each row
        for (let j = 0; j < 5; j++) {
            // Create a div for the box
            let box = document.createElement("div");
            // Add a className to the div
            box.className = "letter-box";
            // Append each box to the row div
            row.appendChild(box);
        }

        // Append the row to the game div created
        board.appendChild(row);
    }
}

// Define the function to insert a letter
function insertLetter(pressedKey) {
    // As the game is only for words with 5 letters,
    // if nextLetter is 5, there is no box or space for the letter
    if (nextLetter === 5) {
        // We ignore the event
        return;
    } 

    // Words in the array WORDS are lowercase
    // We transform the pressed key into lowercase letter
    let pressedKey = pressedKey.toLowerCase();
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

// Define a function to delete a letter
function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = "";
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != 5) {
        alert('Not enough letters!');
        return;
    }

    if (!WORDS.includes(guessString)) {
        alert('Word not in list!')
        return;
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i]);
        // Grey if the letter is in the word to guess
        if (letterPosition === -1) {
            letterColor = '#545454';
        } else {
            // letter is in the word
            // if letter is in the right position
            if (currentGuess[i] === rightGuess[i]) {
                // letter in green
                letterColor = '#538d4e';
            } else {
                // letter in yellow
                letterColor = '#b59f3b';
            }

            rightGuess[letterPosition] = '#';
        }

        let delay = 250 * i;
        setTimeout(() => {
            // shade box
            box.style.backgroundColor = letterColor;
            shadeKeyboard(letter, letterColor);
        }, delay);
    }

    if (guessString === rightGuessString) {
        alert('You guessed the word!');
        guessesRemaining = 0;
        return;
    } else {
        guessesRemaining = -1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            alert('No more guesses!');
            alert(`The right word was: '${rightGuessString}'`);
        }
    }
}

function shadeKeyboard(letter, color) {
    for (const element of document.getElementsByClassName('keyboard-button')) {
        if (element.textContent === letter) {
            let oldColor = element.style.backgroundColor
            // green
            if (oldColor === '#538d4e') {
                return;
            }

            // yellow
            if (oldColor === '#b59f3b' && color !== '#538d4e') {
                return;
            }

            element.style.backgroundColor = color;
            break;
        }
    }
}

// Accept User Input
// We have to listening for the keyup event
document.addEventListener("keyup", (e) => {
    // If the number of guesses is 0, we ignore the event
    if (guessesRemaining === 0) {
        return;
    }

    // Store the pressed key into a variable as a string
    let pressedKey = String(e.key)

    // If the pressed key is BACKSPACE,
    // we delete one letter from the current guess
    // nextLetter has been initialized to 0, so, if it is different of 0,
    // we have at least one letter in the current guess and able to delete
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        // We call the function deleteLetter
        deleteLetter();
        return;
    }

    // If the pressed key is ENTER, we check the current guess
    if (pressedKey === "Enter") {
        // We call the function checkGuess
        checkGuess();
        return;
    }

    // We use a regular expression to check if the pressed key is
    // an alphabetic key, and we store the result in the variable found
    let found = pressedKey.match(/[a-z]/gi);
    // If the pressed key does not have any letter or
    // have multiple letters (like Shift, Tab, ...),
    // we ignore the event
    if (!found || found.length > 1) {
        return;
    } else {
        // Otherwise, we call the function insertLetter to insert
        // the letter in the box
        insertLetter();
    }
});

document.getElementById('keyboard-container').addEventListener('click', (e) => {
    const target = e.target;

    if (!target.classList.contains('keyboard-button')) {
        return;
    }
    let key = target.textContent;

    if (key === 'Del') {
        key = 'Backspace';
    }

    document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))
});

initBoard();