function play_game(ROWS, COLS) {    
    var remaining_points = 300
    var can_remove = true

    const points = document.getElementById('points')
    const level = document.getElementById('level')
    const lines = document.getElementById('lines')
    const time = document.getElementById('time')

    function clock() {
        time.innerText = parseInt(time.innerText) + 1
        setTimeout(clock, 1000)
    }

    var PHYSICS_LOOP_INTERVAL = 1000 / 2;

    let board = [];
    for (let i = 0; i < ROWS; i++) {
        board.push(new Array(COLS).fill(0));
    }

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

    function newPiece() {
        const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        return {
            piece,
            x: Math.floor(COLS / 2) - Math.floor(piece[0].length / 2),
            y: 0
        };
    }

    let currentPiece = newPiece();

    const canvas = document.getElementById('tetrisCanvas')
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
                if (board[i][j] == 1) {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                    ctx.strokeRect(j * 20, i * 20, 20, 20);
                }
            }
        }
    }

    function drawPiece() {
        ctx.fillStyle = '#FF0000'
        for (let i = 0; i < currentPiece.piece.length; i++) {
            for (let j = 0; j < currentPiece.piece[i].length; j++) {
                if (currentPiece.piece[i][j]) {
                    ctx.fillRect((currentPiece.x + j) * 20, (currentPiece.y + i) * 20, 20, 20);
                    ctx.strokeRect((currentPiece.x + j) * 20, (currentPiece.y + i) * 20, 20, 20);
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
            currentPiece = newPiece();
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
                    board[currentPiece.y + i][currentPiece.x + j] = 1;
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
        drawBoard()
        drawPiece()
        setTimeout(gameLoop, 1)
    }

    gameLoop()
    physicsLoop()
    clock()
}
