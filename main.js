const score = document.querySelector(".score");
const startEasy = document.querySelector(".startEasy");
const startMedium = document.querySelector(".startMedium");
const startHard = document.querySelector(".startHard");
const gameArea = document.querySelector(".gameArea");
const car = document.createElement("div");
car.classList.add("car");

startEasy.addEventListener("click", startEasyGame);
startMedium.addEventListener("click", startMediumGame);
startHard.addEventListener("click", startHardGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  trafic: 3,
};

function getQuatityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startEasyGame() {
  startEasy.classList.add("hide");
  startMedium.classList.add("hide");
  startHard.classList.add("hide");
  startGame();
}

function startMediumGame() {
  setting.speed = 5;
  setting.trafic = 2;
  startEasy.classList.add("hide");
  startMedium.classList.add("hide");
  startHard.classList.add("hide");
  startGame();
}

function startHardGame() {
  setting.speed = 7;
  setting.trafic = 2;
  startEasy.classList.add("hide");
  startMedium.classList.add("hide");
  startHard.classList.add("hide");
  startGame();
}

function startGame() {
  gameArea.innerHTML = "";
  for (let i = 0; i < getQuatityElements(100); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.top = i * 100 + "px";
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuatityElements(100 * setting.trafic); i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -100 * setting.trafic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      "transparent url(./image/enemy" +
      Math.floor(Math.random() * Math.floor(3)) +
      ".png) center / cover no-repeat";
    gameArea.appendChild(enemy);
  }
  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = "auto";
  car.style.bottom = "10px";
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = "SCORE<br> " + setting.score;
    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - 50) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";
    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  if (
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowLeft"
  ) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (
    event.key === "ArrowUp" ||
    event.key === "ArrowDown" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowLeft"
  ) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + "px";

    if (line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemies = document.querySelectorAll(".enemy");
  enemies.forEach(function (enemy) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      setting.start = false;
      console.warn("ДТП");
      startEasy.classList.remove("hide");
      startMedium.classList.remove("hide");
      startHard.classList.remove("hide");
      startEasy.style.top = score.offsetHeight;
      startMedium.style.top = score.offsetHeight;
      startHard.style.top = score.offsetHeight;
      saveSettingToLocalStorage(setting);
    }
    enemy.y += setting.speed / 2;
    enemy.style.top = enemy.y + "px";
    if (enemy.y >= document.documentElement.clientHeight) {
      enemy.y = -100 * setting.trafic;
      enemy.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}

function saveSettingToLocalStorage(setting) {
  if (setting.score >= localStorage.getItem("score")) {
    localStorage.setItem("score", setting.score);
    alert("Вы побили рекорд: " + localStorage.getItem("score"));
  }
}
