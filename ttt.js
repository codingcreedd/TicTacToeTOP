const nameInput = (() => {
    
    let name;

    const enterNameSection = document.querySelector('.enter-name-section');
    enterNameSection.style.display = 'flex';

    const submitButton = document.querySelector('.player-input-btn');
    const nameInputSection = document.getElementById('player-name-input');
    const playerName = document.getElementById('player-name');

    submitButton.addEventListener('click', () => {
        name = nameInputSection.value;
        enterNameSection.style.display = 'none';
        playerName.innerText = `${name}`;
    });

    const getName = () => {
        return name;
    }

    return{
        getName
    }

})();



const boardGame = (() => {
    let boardArray = ['', '', '', '', '', '', '', '', ''];

    const countEmptyElements = () => {
        let emptyElements = 0;
        for(let i = 0; i < boardArray.length; i++)
        {
            if(boardArray[i] === '')
                emptyElements++;
        }

        return emptyElements;
    };

    const checkForWin = (choice) => {
        if ((boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2]) && boardArray[0] !== '') {
            return (boardArray[0] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5]) && boardArray[3] !== '') {
            return (boardArray[3] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8]) && boardArray[6] !== '') {
            return (boardArray[6] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6]) && boardArray[0] !== '') {
            return (boardArray[0] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7]) && boardArray[1] !== '') {
            return (boardArray[1] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[2] === boardArray[5] && boardArray[5] === boardArray[8]) && boardArray[2] !== '') {
            return (boardArray[2] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8]) && boardArray[0] !== '') {
            return (boardArray[0] === choice) ? 'player wins' : 'ai wins';
        } else if ((boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) && boardArray[2] !== '') {
            return (boardArray[2] === choice) ? 'player wins' : 'ai wins';
        } else {
            if(countEmptyElements() === 0){
                return 'tie';
            }
        }
    };
    

    const gameFinished = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.innerText = '';
        });

        boardArray.forEach((_, index) => {
            boardArray[index] = '';
          });
    };

    return{
        boardArray,
        countEmptyElements,
        checkForWin,
        gameFinished
    }
})();



const playerModule = (() => {
    const board_game = boardGame;

    let playerChoice = '';
    let playerScore = 0;

    const xChoice = document.getElementById('x');
    const oChoice = document.getElementById('o');
    const playerScoreDiv = document.getElementById('player-score');

    xChoice.addEventListener('click', () => {
        playerChoice = 'X';
    });
    

    oChoice.addEventListener('click', () => {
        playerChoice = 'O';
    });

    const changePlayerScore = () => {
        playerScore++;
        playerScoreDiv.innerText = playerScore;
    };

    const getPlayerChoice = () => {
        return playerChoice;
    };

    return{
        getPlayerChoice,
        changePlayerScore,
        playerScore
    }

})();



function getRandomNumber(){
    return Math.floor(Math.random() * (8 - 0) + 0);
}



const aiModule = (() => {
    const board_game = boardGame;
    let aiChoice = '';
    let aiScore = 0;

    const aiScoreDiv = document.getElementById('ai-score');

    const changeAiScore = () => {
        aiScore++;
        aiScoreDiv.innerText = aiScore;
    };

    const setAiChoice = (playerChoice) => {
        if(playerChoice === 'X')
            aiChoice = 'O';
        else if(playerChoice === 'O')
            aiChoice = 'X';
    }

    const getAiChoice = () => {
        return aiChoice;
    }

    const getAiPlacementChoice = () => {
        let aiPlacementChoice;
        while(true){
            aiPlacementChoice = getRandomNumber();
            if(board_game.boardArray[aiPlacementChoice] === '')
            {
                board_game.boardArray[aiPlacementChoice] = getAiChoice();
                return aiPlacementChoice;
            }
        }
    }

    //return
    return{
        getAiChoice,
        getAiPlacementChoice,
        setAiChoice,
        changeAiScore,
        aiScore
    }

})();



const boardDisplay = (() => {
    const board_game = boardGame;
    const player = playerModule;
    const ai = aiModule;
    const name_input = nameInput;
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {

            if(e.target.innerText === ''){
                e.target.innerText = player.getPlayerChoice();
                ai.setAiChoice(player.getPlayerChoice());
                board_game.boardArray[`${parseInt(e.target.id)}`] = player.getPlayerChoice();

                console.log(board_game.boardArray)
                console.log(board_game.checkForWin(player.getPlayerChoice()))
                if(board_game.checkForWin(player.getPlayerChoice()) === 'player wins'){
                    const displayWinner = document.querySelector('.game-finished');
                    displayWinner.style.display = 'flex';
                    displayWinner.firstElementChild.innerText = `${name_input.getName()} Wins`;
    
                    setTimeout(() => {
                        board_game.gameFinished();
                        displayWinner.style.display = 'none';
                        player.changePlayerScore();
                        board_game.boardArray.fill('');
                    }, 1500);
                }

                const emptyElements = board_game.countEmptyElements();
                if(emptyElements > 1 && (board_game.checkForWin() !== 'player wins' || board_game.checkForWin() !== 'ai wins' )){
                    const aiPlacementChoice = ai.getAiPlacementChoice();
                    board_game.boardArray[`${aiPlacementChoice}`] = ai.getAiChoice();
                    const aiPlacementCell = document.getElementById(`${aiPlacementChoice}`);
                    aiPlacementCell.innerText = ai.getAiChoice();
    
                    if(board_game.checkForWin(player.getPlayerChoice()) === 'ai wins'){
                        const displayWinner = document.querySelector('.game-finished');
                        displayWinner.style.display = 'flex';
                        displayWinner.firstElementChild.innerText = `Ai Wins`;
        
                        setTimeout(() => {
                            board_game.gameFinished();
                            displayWinner.style.display = 'none';
                            ai.changeAiScore();
                            board_game.boardArray.fill('');
                        }, 1500);
                    }
                }
    
                
                if(board_game.checkForWin(player.getPlayerChoice()) === 'tie')
                {
                    const displayWinner = document.querySelector('.game-finished');
                    displayWinner.style.display = 'flex';
                    displayWinner.firstElementChild.innerText = `Tie`;
    
                    setTimeout(() => {
                        board_game.gameFinished();
                        displayWinner.style.display = 'none';
                        board_game.boardArray.fill('');
                    }, 1500);
                }
            }

        });
    });

})();
