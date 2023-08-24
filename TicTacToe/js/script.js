actualTic = 'X'

remainingCells = 9

var analyseWhoWonPointer
var changePlayerNamePointer

function activateCell(param){
    if(remainingCells !== 0 && param.innerText === ' '){
        param.innerText = actualTic
    
        actualTic = (actualTic === 'X') ? 'O' : "X"
    
        remainingCells -= 1
    
        changePlayerNamePointer()
        analyseWhoWonPointer()
    }
}

function playAgain(){
    location.reload()
}

window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);

    const player1Name = urlParams.get("player1") // input
    const player2Name = urlParams.get("player2") // input

    const askName = document.getElementById("askName") // section
    const game = document.getElementById("game") // section
    const win = document.getElementById("win") // section

    const whoWon = document.getElementById("whoWon") // p
    const playerName = document.getElementById("playerName") // p

    var lastName = player1Name

    // player1 always starts

    function changePlayerName(){
        playerName.innerText = lastName + ", it's YOUR TURN";
        
        lastName = (lastName === player1Name) ? player2Name : player1Name
    }

    changePlayerNamePointer = function(){
        changePlayerName()
    }

    function setDisplay(who, value){
        who.style.display = value
    }

    function startGame(){
        setDisplay(askName, 'none')
        setDisplay(game, 'block')
        changePlayerName()
    }

    function parseWinner(winner){
        if (winner === 'X'){
            return player1Name
        }else{
            return player2Name
        }
    }

    function endGame(winner){
        setDisplay(game, 'none')
        setDisplay(win, 'block')

        if (winner === 'draw'){
            whoWon.innerHTML = 'Draw!'
        }else{
            whoWon.innerHTML = `${winner} won!`
        }
    }

    function analyseWhoWon(){
        // 0 1 2
        // 3 4 5
        // 6 7 8
        var cellsValues = Array.from(document.getElementsByClassName("cell")).map(cell => {
            if(cell.innerText == ' '){
                return null
            }else{
                return cell.innerText
            }
        })

        var filteredCellsValue = new Array()

        cellsValues.forEach((e) => {
            if(e != null){
                filteredCellsValue.push(e)
            }else{
                filteredCellsValue.push('')
            }
        })

        cellsValues = filteredCellsValue

        const winningCombos = [
            [0, 1, 2], // 0
            [3, 4, 5], // 1
            [6, 7, 8], // 2
            [0, 3, 6], // 3
            [1, 4, 7], // 4
            [2, 5, 8], // 5
            [0, 4, 8], // 6
            [2, 4, 6]  // 7
        ]
        let winner = null
        winningCombos.forEach(combo => {
            if (cellsValues[combo[0]] === cellsValues[combo[1]] && cellsValues[combo[1]] === cellsValues[combo[2]] && cellsValues[combo[0]] !== ""){
                winner = cellsValues[combo[0]]
            }
        })
        if (winner){
            endGame(parseWinner(winner))
        } else if(remainingCells == 0){
            endGame('draw')
        }
    }

    analyseWhoWonPointer = function(){
        analyseWhoWon()
    }

    if (player1Name && player2Name){
        startGame()
    }else{
        if (urlParams.size > 0){
            alert("Please enter player names")
        }
    }
}