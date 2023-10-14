function play_game(ROWS, COLS) {
    var PHYSICS_LOOP_INTERVAL = 1000 / 2; // 2 FPS

    let board = [];
    for (let i = 0; i < ROWS; i++) {
        board.push(new Array(COLS).fill(0));
    }

    const PIECES = [
        [
            [1] // Especial
        ],
        [
            [1, 1, 1, 1] // Linha
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
    ];

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
                if (board[i][j]) {
                    ctx.fillStyle = '#000'; // Cor da célula preenchida
                    ctx.fillRect(j * 20, i * 20, 20, 20);
                    ctx.strokeRect(j * 20, i * 20, 20, 20);
                }
            }
        }
    }

    function drawPiece() {
        ctx.fillStyle = '#FF0000'; // Cor da peça
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
            if (collides(currentPiece.x, currentPiece.y, currentPiece.piece)) {
                alert('Fim do jogo!'); // Fim do jogo
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

    function checkLines() {
        let linesToRemove = [];
        for (let i = ROWS - 1; i >= 0; i--) {
            if (board[i].every(cell => cell === 1)) {
                linesToRemove.push(i);
            }
        }

        linesToRemove.forEach(line => {
            board.splice(line, 1);
            board.unshift(new Array(COLS).fill(0));
        });
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
        checkLines()
        drawBoard()
        drawPiece()
        setTimeout(gameLoop, 1)
    }

    gameLoop()
    physicsLoop()
}
