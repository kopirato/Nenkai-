// script.js

const gameArea = document.getElementById("gameArea");
const input = document.getElementById("wordInput");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");

const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

let score = 0;
let lives = 5;
let level = 1;

const words = [
  "star",
  "rocket",
  "planet",
  "galaxy",
  "meteor",
  "space",
  "alien",
  "orbit",
  "comet",
  "saturn",
  "typing",
  "future"
];

let activeWords = [];

function createWord(){

  const word = words[
    Math.floor(Math.random() * words.length)
  ];

  const wordEl = document.createElement("div");

  wordEl.classList.add("word");
  wordEl.innerText = word;

  wordEl.style.left =
    Math.random() * (window.innerWidth - 200) + "px";

  wordEl.style.top = "-50px";

  gameArea.appendChild(wordEl);

  const wordObj = {
    text: word,
    element: wordEl,
    y: -50,
    speed: 1 + level * 0.3
  };

  activeWords.push(wordObj);
}

function updateWords(){

  activeWords.forEach((wordObj, index) => {

    wordObj.y += wordObj.speed;

    wordObj.element.style.top = wordObj.y + "px";

    if(wordObj.y > window.innerHeight){

      gameArea.removeChild(wordObj.element);

      activeWords.splice(index,1);

      lives--;

      livesEl.innerText = lives;

      if(lives <= 0){
        gameOver();
      }
    }
  });
}

function gameLoop(){

  updateWords();

  requestAnimationFrame(gameLoop);
}

setInterval(() => {

  createWord();

}, 2000);

input.addEventListener("keydown", (e) => {

  if(e.key === "Enter"){

    const typed = input.value.trim();

    activeWords.forEach((wordObj, index) => {

      if(typed === wordObj.text){

        gameArea.removeChild(wordObj.element);

        activeWords.splice(index,1);

        score += 10;

        scoreEl.innerText = score;

        if(score % 100 === 0){

          level++;

          levelEl.innerText = level;
        }
      }
    });

    input.value = "";
  }
});

function gameOver(){

  gameOverScreen.classList.remove("hidden");

  finalScore.innerText = score;

  input.disabled = true;
}

function restartGame(){

  location.reload();
}

gameLoop();
