/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

function makeBoard() {
  for(let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({length: WIDTH}))
  }
}


function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board")

  // Adds top row for clicking (adds 7th row, not for game, but for inputting red/blue)
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Creates clickable area for top row for adding game peices onto the board. 
  // Creates ID to find for later.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Creates coordinates for the main board to put checkers in after they have been selected
  // from the top row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


//moves piece down to bottom, and not overlap. 1 per box.
function findSpotForCol(x) {
  for(let y = HEIGHT -1; y >= 0; y--) {
    if (!board[y][x]) {
      return y
    }
  }
  return null
}


// Creates the pieces and appends them, to the gamebaord after click 
// So far they only add to the top
function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2); 

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(board.every(row => row.every(cell => cell))) {      
    return endGame("Players 1 and 2 TIE!!!")
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1                       
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {

    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];     //checks for across, +1 to x cehcks left to right
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];      //cecks for vertical. +1 to y checks bottom to top
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];   //checks for diagnal right, adds +1 to y and x for upward right angle
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];   //checks for diagonal left, +1 to y means up, -1 to x means left

      //checks for win possibilities
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
