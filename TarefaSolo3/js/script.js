
function nice(param){
    console.log(param)
}

window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);

    const player1Name = urlParams.get("player1") // input
    const player2Name = urlParams.get("player2") // input

    const askName = document.getElementById("askName") // section
    const game = document.getElementById("game") // section
    const win = document.getElementById("game") // section

    const whoWon = document.getElementById("whoWon") // p
    const playerTurn = document.getElementById("playerTurn") // p

    // player1 always starts

    

    function setDisplay(who, value){
        who.style.display = value
    }

    function startGame(){
        setDisplay(askName, 'none')
        setDisplay(game, 'block')
    }

    function playAgain(){
        window.location.href = "index.html" + (player1Name && player2Name) ? "?player1=" + player1Name + "&player2=" + player2Name : ""
    }


    function parseWinner(winner){
        if (winner === 'X'){
            return player1Name
        }else{
            return player2Name
        }
    }

    function analyseWhoWon(){
        // 0 1 2
        // 3 4 5
        // 6 7 8
        const cellsValues = Array.from(document.getElementsByClassName("cell")).map(cell => cell.innerHTML)
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
        }else{
            endGame('draw')
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

    if (player1Name && player2Name){
        startGame()
    }else{
        if (urlParams.size > 0){
            alert("Please enter player names")
        }
    }
}