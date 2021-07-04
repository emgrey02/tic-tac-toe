
const gameBoard = (() => {
  let _board = ["", "", "", "", "", "", "", "", ""];

  const setTile = (index, sign) => {
    _board[index] = sign;
  }

  const getTile = (index) => {
    return _board[index];
  }

  const reset = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
  }

  return {setTile, getTile, reset};
})();

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return {getSign};
};

const gameController = (() => {
  let playerX = Player('X');
  let playerO = Player('O');
  let round = 1;
  let endRound = false;

  const playRound = (tileIndex) => {
    gameBoard.setTile(tileIndex, getCurrentPlayerSign());

    if (checkWinner()) {
      displayController.setResultMessage(`${getCurrentPlayerSign()}`);
      endRound = true;
      return;
    }

    if (round === 9) {
      displayController.setResultMessage('draw');
      endRound = true;
      return;
    }

    round++;
    displayController.setMessage(`Player ${getCurrentPlayerSign()}'s turn`);
  };

  const getCurrentPlayerSign = () => {
    if (round % 2 === 1) {
      return playerX.getSign();
    } else {
      return playerO.getSign();
    }
  };

  const checkWinner = () => {
    /* [0 1 2]
       [3 4 5]
       [6 7 8] */

    //check rows
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(gameBoard.getTile(j));
      }
      console.log(`row ${i}: ${row}`);

      if ((row.every(tile => tile === 'X')) || (row.every(tile => tile === 'O'))) {
        return true;
      } 
    }
    
    //check columns
    for (let i = 0; i < 3; i++) {
      let column = [];
      for (let j = 0; j < 3; j++) {
        column.push(gameBoard.getTile(j * 3 + i));
      }
      console.log(`column ${i}: ${column}`);

      if ((column.every(tile => tile === 'X')) || (column.every(tile => tile === 'O'))) {
        return true;
      }
    }

    //check diagonals
    let diagonalOne = [gameBoard.getTile(0), gameBoard.getTile(4), gameBoard.getTile(8)];
    let diagonalTwo = [gameBoard.getTile(2), gameBoard.getTile(4), gameBoard.getTile(6)];

    if ((diagonalOne.every(tile => tile === 'X')) || (diagonalOne.every(tile => tile === 'O'))) {
      return true;
    } 

    if ((diagonalTwo.every(tile => tile === 'X')) || (diagonalTwo.every(tile => tile === 'O'))) {
      return true;
    }

    return false;

  }

  const isOver = () => {
    return endRound;
  }

  const reset = () => {
    round = 1;
    endRound = false;
  }

  return {playRound, reset, isOver};

})();

const displayController = (() => {
  let tile = document.querySelectorAll('.tile');
  let messageDiv = document.querySelector('#message');
  let resetButton = document.querySelector('#reset');

  tile.forEach((button) => button.addEventListener('click', (e) => {
    if (gameController.isOver() || button.textContent !== "") return;
    
    gameController.playRound(button.getAttribute('id'));
    updateGameBoard();
    
  }));

  resetButton.addEventListener('click', (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameBoard();
    setMessage("Player X's turn");
  })

  const updateGameBoard = () => {
    for (let i = 0; i < tile.length; i++) {
      tile[i].textContent = gameBoard.getTile(i);
    }
  };

  const setMessage = (message) => {
    messageDiv.textContent = message;
  };

  const setResultMessage = (winner) => {
    if (winner === "draw") {
      setMessage("DRAW");
    } else {
      setMessage(`${winner} is the winner`);
    }
  }

  return {setMessage, setResultMessage};
  
  
})();