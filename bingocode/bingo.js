let board = [];
let mode = "computer";
let playerTurn = true;
let gameOver = false;

let score = {
  player: 0,
  computer: 0,
  p1: 0,
  p2: 0
};

/* SCREEN */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* LOGIN */
function login() {
  let name = document.getElementById("nameInput").value;
  if (!name) return alert("Enter name");

  localStorage.setItem("playerName", name);
  showProfile();
  showScreen("menuScreen");
}

window.onload = function () {
  let name = localStorage.getItem("playerName");

  if (name) {
    showProfile();
    showScreen("menuScreen");
  } else {
    showScreen("loginScreen");
  }
};

/* PROFILE */
function showProfile() {
  let name = localStorage.getItem("playerName");
  let wins = localStorage.getItem("wins") || 0;

  document.getElementById("navName").innerText = name;
  document.getElementById("profileName").innerText = "Name: " + name;
  document.getElementById("profileWins").innerText = "Wins: " + wins;
}

function logout() {
  localStorage.clear();
  location.reload();
}

/* MODE */
function selectMode(m) {
  mode = m;
}

/* START */
function startGame() {
  board = Array.from({ length: 25 }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);

  gameOver = false;
  playerTurn = true;

  renderBoard();

  if (mode === "friend") {
    document.getElementById("roomCode").innerText =
      "Room Code: " + Math.random().toString(36).substring(2,6).toUpperCase();
  } else {
    document.getElementById("roomCode").innerText = "";
  }

  updateTurn();
  updateScoreboard();
  document.getElementById("status").innerText = "";

  showScreen("gameScreen");
}

/* RENDER */
function renderBoard() {
  let container = document.getElementById("board");
  container.innerHTML = "";

  board.forEach(num => {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = num;

    cell.onclick = () => handleMove(cell);

    container.appendChild(cell);
  });
}

/* MOVE */
function handleMove(cell) {
  if (gameOver) return;
  if (cell.classList.contains("marked")) return;

  cell.classList.add("marked");

  checkWin();

  if (mode === "computer") {
    playerTurn = false;
    updateTurn();
    if (!gameOver) setTimeout(aiMove, 400);
  } else {
    playerTurn = !playerTurn;
    updateTurn();
  }
}

/* AI */
function aiMove() {
  if (gameOver) return;

  let cells = Array.from(document.querySelectorAll(".cell"))
    .filter(c => !c.classList.contains("marked"));

  if (cells.length === 0) return;

  let choice = cells[Math.floor(Math.random() * cells.length)];
  choice.classList.add("marked");

  playerTurn = true;
  updateTurn();

  checkWin();
}

/* TURN */
function updateTurn() {
  if (mode === "computer") {
    document.getElementById("turnInfo").innerText =
      playerTurn ? "Your Turn" : "Computer Turn";
  } else {
    document.getElementById("turnInfo").innerText =
      playerTurn ? "Player 1 Turn" : "Player 2 Turn";
  }
}

/* SCORE */
function updateScoreboard() {
  if (mode === "computer") {
    document.getElementById("score1").innerText = "You: " + score.player;
    document.getElementById("score2").innerText = "Computer: " + score.computer;
  } else {
    document.getElementById("score1").innerText = "P1: " + score.p1;
    document.getElementById("score2").innerText = "P2: " + score.p2;
  }
}

/* WIN CHECK */
function checkWin() {
  let cells = Array.from(document.querySelectorAll(".cell"));
  let grid = cells.map(c => c.classList.contains("marked"));

  let patterns = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],
    [15,16,17,18,19],[20,21,22,23,24],
    [0,5,10,15,20],[1,6,11,16,21],
    [2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
    [0,6,12,18,24],[4,8,12,16,20]
  ];

  let lines = 0;

  patterns.forEach(p => {
    if (p.every(i => grid[i])) {
      lines++;
      p.forEach(i => cells[i].classList.add("completed"));
    }
  });

  document.getElementById("status").innerText = "Lines: " + lines;

  if (lines >= 5 && !gameOver) {
    gameOver = true;

    if (mode === "computer") {
      if (playerTurn) {
        score.player++;
        document.getElementById("winSound").play();
        saveWin();
        document.getElementById("status").innerText = "🎉 You Win!";
      } else {
        score.computer++;
        document.getElementById("loseSound").play();
        document.getElementById("status").innerText = "Computer Wins!";
      }
    } else {
      if (playerTurn) {
        score.p1++;
        document.getElementById("status").innerText = "🎉 Player 1 Wins!";
      } else {
        score.p2++;
        document.getElementById("status").innerText = "🎉 Player 2 Wins!";
      }
    }

    updateScoreboard();
  }
}

/* SAVE WIN */
function saveWin() {
  let wins = localStorage.getItem("wins") || 0;
  localStorage.setItem("wins", ++wins);
  showProfile();
}

/* END GAME */
function endGame() {
  gameOver = true;
  document.getElementById("status").innerText = "Game Ended";
}