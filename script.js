const gameBoard = (() => {
  let _board = ["", "", "", "", "", "", "", "", ""];

  const getTile = (index) => {
    return _board[index];
  }

  const getAiTile = (index, board) => {
    return board[index];
  }

  const setTile = (index, sign) => {
    _board[index] = sign;
  }

  const setAiTile = (index, sign, board) => {
    board[index] = sign;
  }

  const getEmptyTiles = (board) => {
    let optionArray;
    if (board) {
      optionArray = board.map((tile, index) => {
        return (tile === "") ? index : undefined
      });
      return optionArray.filter(tile => tile !== undefined);
    } else {
      optionArray = _board.map((tile, index) => {
        return (tile === "") ? index : undefined
      });
      return optionArray.filter(tile => tile !== undefined);
    }
  };

  const reset = () => {
    for (let i = 0; i < 9; i++) {
      _board[i] = "";
    }
  }
  
  return { getTile, getAiTile, setTile, reset, setAiTile, getEmptyTiles };
})();

const Player = (sign) => {
  this.sign = sign;
  
  const getSign = () => {
    return sign;
  }
  
  return { getSign };
};

const minimaxLogic = (() => {

  const _tallyScore = (winner, depth) => {
    return winner === 'O' ? (100 - depth)
         : winner === 'X' ? -100
         : winner === 'tie' ? 0
         : null
  }
  
  const findBestMove = () => {
    let testBoard = gameControl.getCurrentBoard();
    let emptyTiles = gameBoard.getEmptyTiles(testBoard);
    let bestMoveIndex;
    let bestMoveScore = -1000;
    let moveScore;

    emptyTiles.forEach((index) => {
      testBoard[index] = 'O';
      moveScore = _minimax(testBoard, 0, -1000, 1000, false);
      testBoard[index] = "";
      if (moveScore > bestMoveScore) {
        bestMoveScore = moveScore;
        bestMoveIndex = index;
      }
    });
    return bestMoveIndex;
  }
  
  const _minimax = (board, depth, alpha, beta, isMax) => {
    let roundResult = gameControl.checkWinner(board);
    if (roundResult !== false) return _tallyScore(roundResult, depth);

    let emptyTiles = gameBoard.getEmptyTiles(board);
    let moveScore;

    if (isMax) {

      let bestMoveScore = -1000;
      emptyTiles.some((index) => {
        board[index] = 'O';
        moveScore = _minimax(board, depth + 1, alpha, beta, false);
        board[index] = "";
        bestMoveScore = Math.max(bestMoveScore, moveScore);
        alpha = Math.max(alpha, bestMoveScore);
        if (alpha >= beta) return true; 
       });
       return bestMoveScore;

    } else {

      let bestMoveScore = 1000;
      emptyTiles.some((index) => {
        board[index] = 'X';
        moveScore = _minimax(board, depth + 1, alpha, beta, true);
        board[index] = "";
        bestMoveScore = Math.min(bestMoveScore, moveScore);
        // Alpha-beta pruning
        beta = Math.min(beta, bestMoveScore);
        if (alpha >= beta) return true; 
      });
      return bestMoveScore;
    }
  }
  return { findBestMove };

})();

const gameControl = (() => {
  let playerX = Player('X');
  let playerO = Player('O');
  let round = 1;
  let endGame = false;
  
  const playHumanRound = (place) => {
    gameBoard.setTile(place.dataset.key, getCurrentSign());
    finishRound();
  };
  
  const playEasyComputerTurn = () => {
    let options = gameBoard.getEmptyTiles();
    
    let index = 0;
    if (options.length > 1) {
      index = Math.floor(Math.random() * (options.length - 1));
    } else if (options.length === 1) {
      index = Math.floor(Math.random() * 1);
    } else {
      finishRound();
      return;
    }
    gameBoard.setTile(options[index], getCurrentSign());
    displayControl.setMessage(`${getCurrentPlayer()}'s turn`);
    finishRound();
  };

  const playHardComputerTurn = () => {
    let index = minimaxLogic.findBestMove();
    gameBoard.setTile(index, getCurrentSign());
    displayControl.setMessage(`${getCurrentPlayer()}'s turn`);
    finishRound();
  };

  const finishRound = () => {
    if (checkWinner()) {
      if (checkWinner() === 'tie') {
        displayControl.setFinalMessage('draw');
      } else {
        displayControl.setFinalMessage(`${getCurrentPlayer()}`);
      }
      endGame = true;
      return;
    }
    
    round++;
    displayControl.setMessage(`${getCurrentPlayer()}'s turn`);
  }

  const getCurrentBoard = () => {
    let currentBoard =[];
    for (let i=0; i<9; i++) {
      currentBoard.push(gameBoard.getTile(i));
    }
    return currentBoard;
  }
  
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

  const _checkRowWin = (board) => {
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = i * 3; j < i * 3 + 3; j++) {
        if (board) {
          row.push(gameBoard.getAiTile(j, board));
        } else {
          row.push(gameBoard.getTile(j));
        }
      }

      if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
        return [true, row[0]];
      }
    }
    return false;
  }

  const _checkColumnWin = (board) => {
    for (let i = 0; i < 3; i++) {
      let column = []
      for (let j = 0; j < 3; j++) {
        if (board) {
          column.push(gameBoard.getAiTile(i + 3 * j, board));
        } else {
          column.push(gameBoard.getTile(i + 3 * j));
        }
      }

      if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
          return [true, column[0]];
      }
    }
    return false;
  }

  const _checkDiagonalWin = (board) => {
    let diagonal1;
    let diagonal2;

    if (board) {
      diagonal1 = [gameBoard.getAiTile(0, board), gameBoard.getAiTile(4, board), gameBoard.getAiTile(8, board)];
      diagonal2 = [gameBoard.getAiTile(6, board), gameBoard.getAiTile(4, board), gameBoard.getAiTile(2, board)];
    } else {
      diagonal1 = [gameBoard.getTile(0), gameBoard.getTile(4), gameBoard.getTile(8)];
      diagonal2 = [gameBoard.getTile(6), gameBoard.getTile(4), gameBoard.getTile(2)];
    }

    if (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O')) {
      return [true, diagonal1[0]];
    }
    else if (diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O')) {
      return [true, diagonal2[0]];
    }
    return false;
  }

  const _checkForTie = (board) => {
    if (board) {
      return board.every(tile => tile !== "") ? 'tie' : false
    } else {
      let currentBoard = getCurrentBoard();
      return currentBoard.every(tile => tile !== "") ? 'tie' : false
    }
  }

  const checkWinner = (board) => {
    let a, b, c, d;
    if (board) {
      a = _checkRowWin(board);
      b = _checkColumnWin(board);
      c = _checkDiagonalWin(board);
      d = _checkForTie(board);
    } else {
      a = _checkRowWin();
      b = _checkColumnWin();
      c = _checkDiagonalWin();
      d = _checkForTie();
    }

    return a[0] ? a[1]
          : b[0] ? b[1]
          : c[0] ? c[1]
          : d === 'tie' ? 'tie'
          : false;
  };

  const reset = () => {
    round = 1;
    endGame = false;
    displayControl.setMessage(`${getCurrentPlayer()} starts!!`);
  }

  const checkIfOver = () => {
    return endGame;
  }
  
  return { reset, 
          checkIfOver, 
          playHumanRound, 
          playEasyComputerTurn, 
          playHardComputerTurn,
          getCurrentPlayer, 
          getCurrentSign, 
          getCurrentBoard,
          checkWinner 
        };
})();

const displayControl = (() => {
  //game board
  let board = document.querySelector('#game-board');
  let tile = document.querySelectorAll('.tile');

  //message
  let message = document.querySelector('#message');

  //buttons
  let reset = document.querySelector('#reset');
  let start = document.querySelector('#start');
  let submit = document.querySelectorAll('.submit');
  let computerButton = document.querySelector('#computer');
  let playerButton = document.querySelector('#player');
  let easy = document.querySelector('#easy');
  let hard = document.querySelector('#hard');
  let newGame = document.querySelector('#new-game');
  let back = document.querySelector('#back');

  //windows
  let gameChoice = document.querySelector('.game-choice');
  let computerForm = document.querySelector('.computer-form');
  let playerForm = document.querySelector('.player-form');

  //forms
  let computer = document.querySelector('.computer');
  let multiplayer = document.querySelector('.multiplayer');
  let computerDifficulty = document.querySelector('.computer-difficulty');

  //variables
  let computerEasyMode = false;
  let computerHardMode = false;

  reset.disabled = true;
  newGame.disabled = true;
  back.disabled = true;

  const fadeIn = (element) => {
    element.style.transition = "opacity 1.8s ease-out";
    element.style.opacity = 1;
    element.style.zIndex = 99999999;
  }
  
  const fadeOut = (element) => {
    element.style.transition = "opacity 0.3s linear";
    element.style.opacity = 0;
    element.style.zIndex = 0;
  }
  
  const getPlayerNames = () => {
    if (computerEasyMode || computerHardMode) {
      return [computer.elements[0].value, 'computer'];
    } else {
      return [multiplayer.elements[0].value, multiplayer.elements[1].value];
    }
  };
  
  const setUpBoard = () => {
    gameBoard.reset();
    gameControl.reset();
    updateBoard();
    setMessage(`${gameControl.getCurrentPlayer()} starts!`);
  }

  const returnCurrentOpenWindow = () => {
    return (gameChoice.style.opacity == 1) ? 'gameChoice'
         : (computerDifficulty.style.opacity == 1) ? 'computerDifficulty'
         : (computerForm.style.opacity == 1) ? 'computerForm'
         : (playerForm.style.opacity == 1) ? 'playerForm'
         : (board.style.opacity == 1) ? 'board'
         : null
  }

  back.addEventListener('click', () => {
    let currentOpenWindow = returnCurrentOpenWindow();

    if (currentOpenWindow === 'gameChoice') {
      fadeOut(gameChoice);
      start.disabled = false;
      back.disabled = true;
    } else if (currentOpenWindow === 'computerForm') {
      fadeOut(computerForm);
      fadeIn(gameChoice);
    } else if (currentOpenWindow === 'computerDifficulty') {
      fadeOut(computerDifficulty);
      fadeIn(computerForm);
    } else if (currentOpenWindow === 'playerForm') {
      fadeOut(playerForm);
      fadeIn(gameChoice);
    } else if (currentOpenWindow === 'board') {
      fadeOut(board);
      newGame.disabled = true;
      reset.disabled = true;
      if (computerEasyMode || computerHardMode) {
        fadeIn(computerDifficulty);
      } else {
        fadeIn(playerForm);
      }
    }    
  });
  
  newGame.addEventListener('click', () => {
    fadeOut(board);
    fadeIn(gameChoice);
    start.disabled = true;
    newGame.disabled = true;
    reset.disabled = true;
  })

  start.addEventListener('click', () => {
    computerEasyMode = false;
    computerHardMode = false;
    fadeIn(gameChoice);
    start.disabled = true;
    back.disabled = false;
  });

  computerButton.addEventListener('click', () => {
    fadeOut(gameChoice);
    fadeIn(computerForm);
  })

  playerButton.addEventListener('click', () => {
    fadeOut(gameChoice);
    fadeIn(playerForm);
  })
  
  easy.addEventListener('click', () => {
    computerEasyMode = true;
    computerHardMode = false;
    fadeOut(computerDifficulty);
    setTimeout(fadeIn(board), 1000);
    setUpBoard();
    reset.disabled = false;
    newGame.disabled = false;
  })

  hard.addEventListener('click', () => {
    computerHardMode = true;
    computerEasyMode = false;
    fadeOut(computerDifficulty);
    setTimeout(fadeIn(board), 1000);
    setUpBoard();
    reset.disabled = false;
    newGame.disabled = false;
  })

  
  submit.forEach(button => button.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (button.form.className === 'multiplayer') {
      computerEasyMode = false;
      computerHardMode = false;
      fadeOut(playerForm);
      setTimeout(fadeIn(board), 1000);
      setUpBoard();
      reset.disabled = false;
      newGame.disabled = false;
    } else {
      fadeOut(computerForm);
      fadeIn(computerDifficulty); 
    }
    
  }));
  
  tile.forEach(place => place.addEventListener('click', (e) => {
    if (gameControl.checkIfOver() || e.target.localName == "img" || e.target.innerHTML !== "") return;
    
    gameControl.playHumanRound(place);
    
    if (computerEasyMode && !(gameControl.checkIfOver())) {
      setTimeout(function () {
        gameControl.playEasyComputerTurn();
        updateBoard();
      }, 700);
    } else if (computerHardMode && !(gameControl.checkIfOver())) {
      setTimeout(function() {
        gameControl.playHardComputerTurn();
        updateBoard();
      }, 700);
    }
    
    updateBoard();

  }));
  
  reset.addEventListener('click', (e) => {
    gameBoard.reset();
    gameControl.reset();
    updateBoard();
  });

  const updateBoard = () => {
    for (let i = 0; i < 9; i++) {
      let token = gameBoard.getTile(i);
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