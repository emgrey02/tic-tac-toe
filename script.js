
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
  let round = 1;
  let endGame = false;
  
  const playRound = (place) => {
    gameBoard.setTile(place.dataset.row, place.dataset.column, getCurrentSign());
    
    if (checkWinner()) {
      displayControl.setFinalMessage(`${getCurrentPlayer()}`);
      endGame = true;
      return;
    }
    
    if (round > 8) {
      displayControl.setFinalMessage('draw');
      endGame = true;
      return;
    }
    
    round++;
    displayControl.setMessage(`${getCurrentPlayer()}'s turn`);
  };

  const getCurrentSign = () => {
    if (round % 2 === 1) {
      return playerX.getSign();
    } else {
      return playerO.getSign();
    }
  }

  const getCurrentPlayer = () => {
    let playerArray = displayControl.getPlayerNames();
    if (round % 2 === 1) {
      return playerArray[0];
    } else {
      return playerArray[1];
    }
  }

  const checkWinner = () => {
    //check rows
    for (let i=0; i<3; i++) {
      let row=[];
      for (let j=0; j<3; j++) {
        row.push(gameBoard.getTile(i, j));
      }

      if (row.every(tile => tile === 'X') || (row.every(tile => tile === 'O'))) {
        return true;
      }
    }

    //check columns
    for (let i=0; i<3; i++) {
      let column=[];
      for (let j=0; j<3; j++) {
        column.push(gameBoard.getTile(j, i));
      }

      if (column.every(tile => tile === 'X') || (column.every(tile => tile === 'O'))) {
        return true;
      }
    }

    //check diagonals
    let diagonal1 = [gameBoard.getTile(0, 0), gameBoard.getTile(1,1), gameBoard.getTile(2,2)];
    let diagonal2 = [gameBoard.getTile(0,2), gameBoard.getTile(1,1), gameBoard.getTile(2,0)];

    if (diagonal1.every(tile => tile === 'X') || diagonal1.every(tile => tile === 'O')) {
      return true;
    }
    if (diagonal2.every(tile => tile === 'X') || diagonal2.every(tile => tile === 'O')) {
      return true;
    }

    return false;
  };

  const reset = () => {
    round = 1;
    endGame = false;
    displayControl.setMessage(`${getCurrentPlayer()} starts!!`);
  }

  const checkIfOver = () => endGame;
  
  return { reset, checkIfOver, playRound, getCurrentPlayer };
})();

const displayControl = (() => {
  let tile = document.querySelectorAll('.tile');
  let message = document.querySelector('#message');
  let reset = document.querySelector('#reset');
  let start = document.querySelector('#start');
  let form = document.querySelector('form');
  let playerForm = document.querySelector('.player-form');
  let submit = document.querySelector('#submit');
  let board = document.querySelector('#game-board');

  
  const fadeIn = (element) => {
    element.style.transition = "opacity 1.8s ease-out, left 1s ease-out";
    element.style.opacity = 1;
    element.style.left = 0;
    element.style.zIndex = 99999999;
  }
  
  const fadeOut = (element) => {
    element.style.transition = "opacity 0.5s ease-in, left 1s ease-in";
    element.style.opacity = 0;
    element.style.left = "-200%";
  }

  const getPlayerNames = () => {
    return [form.elements[0].value, form.elements[1].value];
  };

  window.addEventListener('load', fadeIn(board));
  
  start.addEventListener('click', () => {
    fadeOut(board);
    fadeIn(playerForm);
  });
  
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    fadeOut(playerForm);
    setTimeout(fadeIn(board), 1000);
    gameBoard.reset();
    gameControl.reset();
    updateBoard();
    setMessage(`${gameControl.getCurrentPlayer()} starts!`);
  });
  
  tile.forEach(place => place.addEventListener('click', (e) => {
    if (gameControl.checkIfOver() || e.target.localName == "img" || e.target.innerHTML !== "") return;
    gameControl.playRound(place);
    updateBoard();
  }));
  
  reset.addEventListener('click', (e) => {
    gameBoard.reset();
    gameControl.reset();
    updateBoard();
  });

  const updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      let token = gameBoard.getTile(tile[i].dataset.row, tile[i].dataset.column);
      if (token) {
        displayToken(token, i);
      } else {
        tile[i].innerHTML = "";
      }
    }
  }

  const displayToken = (token, numToken) => {
    if (token === "X") {
      tile[numToken].innerHTML = "<img src='images/x-icon.png' alt='X tile'>";
    } else {
      tile[numToken].innerHTML = "<img src='images/o-icon.png' alt='O tile'>";
    }
  }

  const setMessage = (msg) => {
    message.textContent = msg;
  }

  const setFinalMessage = (winner) => {
    if (winner === 'draw') {
      message.textContent = "it's a draw";
    } else {
      message.textContent = `${winner} wins!`;
    }
  }

  return { setMessage, setFinalMessage, getPlayerNames };

})();