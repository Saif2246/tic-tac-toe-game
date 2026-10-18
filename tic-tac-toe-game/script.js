const cells = Array.from(document.querySelectorAll(".cell"));
const statusMessage = document.getElementById("status");
const restartButton = document.getElementById("restart");
const resetScoresButton = document.getElementById("reset-scores");
const playerXCard = document.getElementById("player-x");
const playerOCard = document.getElementById("player-o");
const scoreXLabel = document.getElementById("score-x");
const scoreOLabel = document.getElementById("score-o");

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let scores = { X: 0, O: 0 };

function getWinningCombination() {
  return winningCombinations.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

function updateTurnDisplay() {
  playerXCard.classList.toggle("active", currentPlayer === "X" && gameActive);
  playerOCard.classList.toggle("active", currentPlayer === "O" && gameActive);
}

function updateScores() {
  scoreXLabel.textContent = `Wins: ${scores.X}`;
  scoreOLabel.textContent = `Wins: ${scores.O}`;
}

function playMove(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.disabled = true;
  cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${currentPlayer}`);

  const winningCombination = getWinningCombination();

  if (winningCombination) {
    gameActive = false;
    winningCombination.forEach((winningIndex) => cells[winningIndex].classList.add("winning"));
    scores[currentPlayer] += 1;
    updateScores();
    statusMessage.textContent = `Player ${currentPlayer} wins!`;
    statusMessage.className = "status winner";
    cells.forEach((button) => button.disabled = true);
    updateTurnDisplay();
    return;
  }

  if (board.every((value) => value !== "")) {
    gameActive = false;
    statusMessage.textContent = "It's a draw! Good game.";
    statusMessage.className = "status draw";
    updateTurnDisplay();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
  statusMessage.className = "status";
  updateTurnDisplay();
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "winning");
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}`);
  });

  statusMessage.textContent = "Player X's turn";
  statusMessage.className = "status";
  updateTurnDisplay();
}

function resetScores() {
  scores = { X: 0, O: 0 };
  updateScores();
  restartGame();
}

cells.forEach((cell) => cell.addEventListener("click", playMove));
restartButton.addEventListener("click", restartGame);
resetScoresButton.addEventListener("click", resetScores);
updateScores();
updateTurnDisplay();
