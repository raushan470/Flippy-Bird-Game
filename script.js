let move_speed = 3;
let gravity = 0.5;

const bird = document.querySelector(".bird");
const img = document.getElementById("bird-1");
const score_val = document.querySelector(".score_val");
const message = document.querySelector(".message");
const score_title = document.querySelector(".score_title");
const gameArea = document.querySelector(".game-area");

let sound_point = new Audio("sounds effect/point.mp3");
let sound_die = new Audio("sounds effect/die.mp3");

let bird_dy = 0;
let game_state = "Start";
let pipe_separation = 0;
let animationIdMove;
let animationIdGravity;
let animationIdPipe;

function getGameBounds() {
  return gameArea.getBoundingClientRect();
}

function getBirdProps() {
  return bird.getBoundingClientRect();
}

function isMobile() {
  return window.innerWidth <= 768;
}

function resetGame() {
  document.querySelectorAll(".pipe_sprite").forEach((e) => e.remove());

  const bounds = getGameBounds();

  bird.style.display = "block";
  bird.style.left = `${bounds.width * 0.2}px`;
  bird.style.top = `${bounds.height * 0.4}px`;

  img.src = "images/Bird.png";

  bird_dy = 0;
  pipe_separation = 0;
  game_state = "Play";

  score_title.innerHTML = "Score : ";
  score_val.innerHTML = "0";

  message.innerHTML = "";
  message.classList.remove("messageStyle");

  play();
}

function endGame() {
  game_state = "End";
  message.innerHTML = "Game Over<br>Tap / Press Enter To Restart";
  message.classList.add("messageStyle");
  message.style.left = "50%";
  message.style.top = "30%";
  img.style.display = "none";

  sound_die.currentTime = 0;
  sound_die.play().catch(() => {});

  cancelAnimationFrame(animationIdMove);
  cancelAnimationFrame(animationIdGravity);
  cancelAnimationFrame(animationIdPipe);
}

function move() {
  if (game_state !== "Play") return;

  const bird_props = getBirdProps();
  const pipe_sprite = document.querySelectorAll(".pipe_sprite");

  pipe_sprite.forEach((element) => {
    const pipe_props = element.getBoundingClientRect();

    if (pipe_props.right <= 0) {
      element.remove();
    } else {
      if (
        bird_props.left < pipe_props.left + pipe_props.width &&
        bird_props.left + bird_props.width > pipe_props.left &&
        bird_props.top < pipe_props.top + pipe_props.height &&
        bird_props.top + bird_props.height > pipe_props.top
      ) {
        endGame();
      } else {
        if (
          pipe_props.right < bird_props.left &&
          pipe_props.right + move_speed >= bird_props.left &&
          element.increase_score === "1"
        ) {
          score_val.innerHTML = Number(score_val.innerHTML) + 1;
          element.increase_score = "0";
          sound_point.currentTime = 0;
          sound_point.play().catch(() => {});
        }
        element.style.left = pipe_props.left - move_speed + "px";
      }
    }
  });

  animationIdMove = requestAnimationFrame(move);
}

function applyGravity() {
  if (game_state !== "Play") return;

  const bounds = getGameBounds();
  let bird_props = getBirdProps();

  bird_dy += gravity;
  bird.style.top = bird_props.top - bounds.top + bird_dy + "px";

  bird_props = getBirdProps();

  if (bird_props.top <= bounds.top || bird_props.bottom >= bounds.bottom) {
    endGame();
    return;
  }

  animationIdGravity = requestAnimationFrame(applyGravity);
}

function createPipe() {
  if (game_state !== "Play") return;

  pipe_separation++;

  const bounds = getGameBounds();

  if (pipe_separation > (isMobile() ? 85 : 115)) {
    pipe_separation = 0;

    let pipe_gap = isMobile() ? 130 : 190;
    let pipe_width = isMobile() ? 60 : 80;

    let topPipeHeight = Math.floor(Math.random() * (bounds.height * 0.45)) + 50;
    let bottomPipeTop = topPipeHeight + pipe_gap;
    let bottomPipeHeight = bounds.height - bottomPipeTop;

    if (bottomPipeHeight > 50) {
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.left = bounds.width + "px";
      pipe_sprite_inv.style.top = "0px";
      pipe_sprite_inv.style.width = pipe_width + "px";
      pipe_sprite_inv.style.height = topPipeHeight + "px";

      gameArea.appendChild(pipe_sprite_inv);

      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.left = bounds.width + "px";
      pipe_sprite.style.top = bottomPipeTop + "px";
      pipe_sprite.style.width = pipe_width + "px";
      pipe_sprite.style.height = bottomPipeHeight + "px";
      pipe_sprite.increase_score = "1";

      gameArea.appendChild(pipe_sprite);
    }
  }

  animationIdPipe = requestAnimationFrame(createPipe);
}

function play() {
  move();
  applyGravity();
  createPipe();
}

function flap() {
  if (game_state === "Play") {
    bird_dy = isMobile() ? -7.5 : -7.6;
    img.src = "images/Bird-2.png";
    setTimeout(() => {
      img.src = "images/Bird.png";
    }, 120);
  } else if (game_state === "Start") {
    resetGame();
  } else if (game_state === "End") {
    resetGame();
  }
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" ||
    e.key === "ArrowUp" ||
    e.key === " "
  ) {
    flap();
  }
});

document.addEventListener("touchstart", (e) => {
  e.preventDefault();
  flap();
}, { passive: false });

document.addEventListener("click", () => {
  if (!isMobile()) {
    flap();
  }
});

window.addEventListener("resize", () => {
  if (game_state === "Play") {
    const bounds = getGameBounds();
    const bird_props = getBirdProps();

    if (bird_props.bottom > bounds.bottom) {
      bird.style.top = `${bounds.height - bird.offsetHeight - 10}px`;
    }
  }
});

img.style.display = "none";
score_title.innerHTML = "";
score_val.innerHTML = "";
message.classList.add("messageStyle");
