
const gameBoard = (() => {
  let _board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  const getTile = (row, column) => {
    return _board[row][column];
  }

  const setTile = (row, column, sign) => {
    _board[row][column] = sign;
  }

  const reset = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        _board[i][j] = "";
      }
    }
  }

  return { getTile, setTile, reset };
})();

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  }

  return { getSign };
};

const gameControl = (() => {
  let playerX = Player('X');
  let playerO = Player('O');
  let _round = 1;
  let endGame = false;

  const countRound = () => {
    _round++;
  };

  const playRound = (place) => {
    console.log(`round ${_round}`);
    gameBoard.setTile(place.dataset.row, place.dataset.column, getCurrentSign());
    console.log('tile set');

    if (checkWinner()) {
      console.log('checkWinner is true for some reason');
      displayControl.setFinalMessage(`${getCurrentSign()}`);
      endGame = true;
    }
    console.log('checked winner...none rn');
    
    if (_round > 9) {
      reset();
      displayControl.setFinalMessage('draw');
    }
    console.log('checked if gameboard filled out');

    countRound();
    displayControl.setMessage(`player ${getCurrentSign()}'s turn`);
    console.log('time for the next round');
    console.log(`is the game over? ${checkIfOver()}`);
  };

  const getCurrentSign = () => {
    if (_round % 2 === 1) {
      return playerX.getSign();
    } else {
      return playerO.getSign();
    }
  }

  const checkWinner = () => {
    return false;
  };

  const reset = () => {
    _round = 1;
    endGame = true;
    displayControl.setMessage("player X's turn");
  }

  const checkIfOver = () => endGame;
  
  return { checkWinner, reset, checkIfOver, playRound };
})();

const displayControl = (() => {
  let tile = document.querySelectorAll('.tile');
  let message = document.querySelector('#message');
  let reset = document.querySelector('#reset');
  
  tile.forEach(place => place.addEventListener('click', (e) => {
    if (gameControl.checkIfOver() || e.target.textContent !== "") return;
    
    gameControl.playRound(e.target);
  

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        place.textContent = gameBoard.getTile(i, j);
      }
    }
    
  }));
  
  reset.addEventListener('click', (e) => {
    gameBoard.reset();
    gameControl.reset();
  });

  const setMessage = (msg) => {
    message.textContent = msg;
  }

  const setFinalMessage = (winner) => {
    if (winner === 'draw') {
      message.textContent = `it's a draw`;
    } else {
      message.textContent = `player ${winner} won`;
    }
  }
  

  return { setMessage, setFinalMessage };

})();
