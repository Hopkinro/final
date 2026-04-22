const pages = document.querySelectorAll('.page');
const currentPlayer = document.getElementById('currentPlayer');
const playerNameInput = document.getElementById('playerName');
const playerMirrors = document.querySelectorAll('.playerNameMirror');
const homeBtn = document.getElementById('homeBtn');

function setPlayerName(name) {
  const safe = name.trim() || 'Player 1';
  currentPlayer.textContent = safe;
  playerMirrors.forEach(el => el.textContent = safe);
  localStorage.setItem('gamehub-player', safe);
}

function showPage(id) {
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.querySelectorAll('.game-card').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

homeBtn.addEventListener('click', () => showPage('hubPage'));
playerNameInput.addEventListener('input', e => setPlayerName(e.target.value));

const savedName = localStorage.getItem('gamehub-player') || 'Player 1';
playerNameInput.value = savedName === 'Player 1' ? '' : savedName;
setPlayerName(savedName);

// RPS
let rps = { wins: 0, losses: 0, ties: 0 };
const rpsStatus = document.getElementById('rpsStatus');
const rpsScore = document.getElementById('rpsScore');
function updateRpsScore() {
  rpsScore.textContent = `Wins: ${rps.wins} | Losses: ${rps.losses} | Ties: ${rps.ties}`;
}
document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const user = btn.dataset.choice;
    const choices = ['Rock', 'Paper', 'Scissors'];
    const cpu = choices[Math.floor(Math.random() * 3)];
    let result = 'Tie';
    if (user === cpu) rps.ties++;
    else if ((user === 'Rock' && cpu === 'Scissors') || (user === 'Paper' && cpu === 'Rock') || (user === 'Scissors' && cpu === 'Paper')) { rps.wins++; result = 'You win'; }
    else { rps.losses++; result = 'You lose'; }
    rpsStatus.textContent = `${result}. You picked ${user}, computer picked ${cpu}.`;
    updateRpsScore();
  });
});
document.getElementById('resetRps').addEventListener('click', () => {
  rps = { wins: 0, losses: 0, ties: 0 };
  rpsStatus.textContent = 'Make your move.';
  updateRpsScore();
});
updateRpsScore();

// Tic Tac Toe
const tttBoard = document.getElementById('tttBoard');
const tttStatus = document.getElementById('tttStatus');
let ttt = Array(9).fill('');
let turn = 'X';
let tttOver = false;
const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function renderTtt() {
  tttBoard.innerHTML = '';
  ttt.forEach((value, index) => {
    const btn = document.createElement('button');
    btn.className = 'ttt-cell';
    btn.textContent = value;
    btn.addEventListener('click', () => playTtt(index));
    tttBoard.appendChild(btn);
  });
}
function playTtt(index) {
  if (ttt[index] || tttOver) return;
  ttt[index] = turn;
  const winLine = wins.find(line => line.every(i => ttt[i] === turn));
  if (winLine) { tttStatus.textContent = `Winner: ${turn}`; tttOver = true; renderTtt(); return; }
  if (ttt.every(Boolean)) { tttStatus.textContent = 'Draw game'; tttOver = true; renderTtt(); return; }
  turn = turn === 'X' ? 'O' : 'X';
  tttStatus.textContent = `Turn: ${turn}`;
  renderTtt();
}
document.getElementById('resetTtt').addEventListener('click', () => {
  ttt = Array(9).fill(''); turn = 'X'; tttOver = false; tttStatus.textContent = 'Turn: X'; renderTtt();
});
renderTtt();

// Wordle
const targetWord = 'APPLE';
let wordleRemaining = 6;
const wordleInput = document.getElementById('wordleInput');
const wordleGuesses = document.getElementById('wordleGuesses');
const wordleStatus = document.getElementById('wordleStatus');
document.getElementById('submitWordle').addEventListener('click', () => {
  const guess = wordleInput.value.toUpperCase();
  if (guess.length !== 5) { wordleStatus.textContent = 'Enter exactly 5 letters.'; return; }
  if (wordleRemaining <= 0) return;
  const item = document.createElement('div');
  item.className = 'guess-item';
  item.textContent = guess === targetWord ? `${guess} - correct!` : `${guess} - not correct`;
  wordleGuesses.appendChild(item);
  wordleRemaining--;
  if (guess === targetWord) wordleStatus.textContent = 'You guessed the word!';
  else if (wordleRemaining === 0) wordleStatus.textContent = 'Out of guesses. The word was APPLE.';
  else wordleStatus.textContent = `${wordleRemaining} guesses left.`;
  wordleInput.value = '';
});
document.getElementById('resetWordle').addEventListener('click', () => {
  wordleRemaining = 6; wordleGuesses.innerHTML = ''; wordleStatus.textContent = '6 guesses left.'; wordleInput.value = '';
});

// Hangman
const hangmanTarget = 'CODING';
let hangmanUsed = [];
let wrong = 0;
const hangmanWord = document.getElementById('hangmanWord');
const hangmanUsedText = document.getElementById('hangmanUsed');
const hangmanStatus = document.getElementById('hangmanStatus');
const hangmanInput = document.getElementById('hangmanInput');
function renderHangman() {
  hangmanWord.textContent = hangmanTarget.split('').map(ch => hangmanUsed.includes(ch) ? ch : '_').join(' ');
  hangmanUsedText.textContent = `Used: ${hangmanUsed.length ? hangmanUsed.join(', ') : 'none'}`;
  const complete = hangmanTarget.split('').every(ch => hangmanUsed.includes(ch));
  if (complete) hangmanStatus.textContent = 'You won!';
  else if (wrong >= 6) hangmanStatus.textContent = `You lost. Word was ${hangmanTarget}.`;
  else hangmanStatus.textContent = `${6 - wrong} wrong guesses left.`;
}
document.getElementById('guessHangman').addEventListener('click', () => {
  const guess = hangmanInput.value.toUpperCase();
  if (!guess || hangmanUsed.includes(guess) || wrong >= 6) { hangmanInput.value = ''; return; }
  hangmanUsed.push(guess);
  if (!hangmanTarget.includes(guess)) wrong++;
  hangmanInput.value = '';
  renderHangman();
});
document.getElementById('resetHangman').addEventListener('click', () => {
  hangmanUsed = []; wrong = 0; hangmanInput.value = ''; renderHangman();
});
renderHangman();
