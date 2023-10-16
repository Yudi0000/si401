
let currentPiece, nextPiece;
let ctx;
const canvas = document.getElementById('tetrisCanvas');
ctx = canvas.getContext('2d'); // Inicialize ctx aqui
const PIECES = [
    [
        [1, 1, 1, 1] // Linha
    ],
    [
        [1] // Especial
    ],
    [
        [1, 1, 1],
        [0, 1, 0] // T
    ],
    [
        [1, 1, 1],
        [1, 0, 0] // L
    ],
    [
        [1, 1, 1],
        [0, 0, 1] // L invertido
    ],
    [
        [1, 1],
        [1, 1] // Quadrado
    ],
    [
        [1, 1, 0],
        [0, 1, 1] // Z
    ],
    [
        [0, 1, 1],
        [1, 1, 0] // Z invertido
    ],
    [
        [1, 0, 1],
        [1, 1, 1] // U
    ]
]

const PIECE_COLORS = {
    1: '#FFD700', // Dourado para peça unitária
    2: '#FF0000', // Vermelho para a primeira peça
    3: '#00FF00', // Verde para a segunda peça
    4: '#0000FF', // Azul para a terceira peça
    5: '#FFA500', // Laranja para a quarta peça
    6: '#800080', // Roxo para a quinta peça
    7: '#00FFFF', // Ciano para a sexta peça
    8: '#FF00FF', // Magenta para a sétima peça
    9: '#FFFF00', // Amarelo para a oitava peça
};

function drawNextPiece(nextPiece) {
    const nextCanvas = document.getElementById('nextPieceCanvas');
    const ctx = nextCanvas.getContext('2d');
    const cellSize = nextCanvas.width / nextPiece.piece[0].length;

    ctx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

    for (let i = 0; i < nextPiece.piece.length; i++) {
        for (let j = 0; j < nextPiece.piece[i].length; j++) {
            if (nextPiece.piece[i][j]) {
                ctx.fillStyle = PIECE_COLORS[nextPiece.piece[i][j] > 1 ? nextPiece.piece[i][j] - 1 : 1];
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}

function play_game(ROWS, COLS) {    
    var remaining_points = 300
    var can_remove = true

    const points = document.getElementById('points')
    const level = document.getElementById('level')
    const lines = document.getElementById('lines')
   
    currentPiece = newPiece();
    nextPiece = newPiece();
    drawNextPiece(nextPiece); 

    function clock() {
        const timeElement = document.getElementById('time');
        const currentTime = timeElement.innerText.split(':');
        let minutes = parseInt(currentTime[0]);
        let seconds = parseInt(currentTime[1]);
    
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
    
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeElement.innerText = formattedTime;
    
        setTimeout(clock, 1000);
    }

    var PHYSICS_LOOP_INTERVAL = 1000 / 2;

    let board = [];
    for (let i = 0; i < ROWS; i++) {
        board.push(new Array(COLS).fill(0));
    }

    function drawPiece() {
        for (let i = 0; i < currentPiece.piece.length; i++) {
            for (let j = 0; j < currentPiece.piece[i].length; j++) {
                if (currentPiece.piece[i][j]) {
                    ctx.fillStyle = PIECE_COLORS[currentPiece.piece[i][j] > 1 ? currentPiece.piece[i][j] - 1 : 1];
                    ctx.fillRect((currentPiece.x + j) * 20, (currentPiece.y + i) * 20, 20, 20);
                    ctx.strokeRect((currentPiece.x + j) * 20, (currentPiece.y + i) * 20, 20, 20);
                }
            }
        }
    }

    function generateNewPiece() {
        currentPiece = nextPiece;
        nextPiece = newPiece();
        drawNextPiece(nextPiece); // Atualize a próxima peça
    }


    function newPiece() {
        const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        // Atribua um valor exclusivo a cada tipo de peça
        const pieceValue = PIECES.indexOf(piece) + 2; // +2 para evitar valores 0 e 1
        return {
            piece: piece.map(row => row.map(cell => cell * pieceValue)), // Multiplica a peça pelo valor
            x: Math.floor(COLS / 2) - Math.floor(piece[0].length / 2),
            y: 0
        };
    }
    const tetris_content = document.getElementById('tetris_content')
    const choose_board = document.getElementById('choose_board')
    const ctx = canvas.getContext('2d')
    canvas.style.display = 'block'
    tetris_content.style.display = 'grid'
    choose_board.style.display = 'none'
    canvas.width = COLS * 20
    canvas.height = ROWS * 20

    function collides(x, y, piece) {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] && (board[y + i] && board[y + i][x + j]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (board[i][j] != 0) {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                    ctx.strokeRect(j * 20, i * 20, 20, 20);
                }
            }
        }
    }

    function clearPiece() {
        for (let i = 0; i < currentPiece.piece.length; i++) {
            for (let j = 0; j < currentPiece.piece[i].length; j++) {
                if (currentPiece.piece[i][j]) {
                    board[currentPiece.y + i][currentPiece.x + j] = 0;
                }
            }
        }
    }

    function moveDown() {
        clearPiece();
        currentPiece.y++;
        if (collides(currentPiece.x, currentPiece.y, currentPiece.piece)) {
            currentPiece.y--;
            placePiece();
            generateNewPiece();
            can_remove = true
            checkLines()
            if (collides(currentPiece.x, currentPiece.y, currentPiece.piece)) {
                alert('Fim do jogo!')
            }
        }
    }

    function moveLeft() {
        clearPiece();
        currentPiece.x--;
        if (collides(currentPiece.x, currentPiece.y, currentPiece.piece)) {
            currentPiece.x++;
        }
    }

    function moveRight() {
        clearPiece();
        currentPiece.x++;
        if (collides(currentPiece.x, currentPiece.y, currentPiece.piece)) {
            currentPiece.x--;
        }
    }

    function rotatePiece() {
        const rotatedPiece = [];
        for (let i = 0; i < currentPiece.piece[0].length; i++) {
            let row = [];
            for (let j = currentPiece.piece.length - 1; j >= 0; j--) {
                row.push(currentPiece.piece[j][i]);
            }
            rotatedPiece.push(row);
        }

        if (!collides(currentPiece.x, currentPiece.y, rotatedPiece)) {
            currentPiece.piece = rotatedPiece;
        }
    }

    function placePiece() {
        for (let i = 0; i < currentPiece.piece.length; i++) {
            for (let j = 0; j < currentPiece.piece[i].length; j++) {
                if (currentPiece.piece[i][j]) {
                    board[currentPiece.y + i][currentPiece.x + j] = currentPiece.piece[i][j];
                }
            }
        }
    }

    function pullDownOneTimeFromLine(line) {
        for (let i = line; i >= 0; i--) {
            for (let j = 0; j < COLS; j++) {
                if (board[i][j] === 0) {
                    let x = i - 1
                    if (x >= 0) {
                        if (board[x][j] !== 0) {
                            board[i][j] = board[x][j]
                            board[x][j] = 0
                        }
                    }
                }
            }
        }
    }

    function needToRemoveLine(line) {
        for (let i = 0; i < COLS; i++) {
            if (board[line][i] === 0) {
                return false
            }
        }
        return true
    }

    function checkLines() {
        if (can_remove) {

            let linesToRemove = []
            for (let i = 0; i < ROWS; i++) {
                if (needToRemoveLine(i)) {
                    linesToRemove.push(i)
                }
            }
    
            if (linesToRemove.length > 0) {
                linesToRemove.forEach(line => {
                    for (let i = 0; i < COLS ; i++) {
                        board[line][i] = 0;
                    }
                    pullDownOneTimeFromLine(line)
                    lines.innerText = parseInt(lines.innerText) + 1
                })
        
                points.innerText = parseInt(points.innerText) + (10 * (linesToRemove.length * linesToRemove.length))
        
                remaining_points -= parseInt(points.innerText)
        
                if (remaining_points <= 0) {
                    level.innerText = parseInt(level.innerText) + 1
                    remaining_points += 300
                }
            }
            can_remove = false
        }
    }
    

    document.addEventListener('keydown', event => {
        switch (event.code) {
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
        }
    });

    function physicsLoop() {
        moveDown()
        setTimeout(physicsLoop, PHYSICS_LOOP_INTERVAL)
    }

    function gameLoop() {
        drawBoard();
        drawPiece();
        setTimeout(gameLoop, 1);
    }

    gameLoop()
    physicsLoop()
    clock()
}
