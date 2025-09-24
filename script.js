document.addEventListener('DOMContentLoaded', () => {
    const puzzleGrid = document.getElementById('puzzle-grid');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetBtn = document.getElementById('reset-btn');
    const messageDisplay = document.getElementById('message');
    const imagePath = 'maxresdefault.jpg'; // Make sure this image is in the same folder

    let pieces = [];
    const solutionOrder = Array.from({ length: 9 }, (_, i) => i);
    let currentOrder = [];

    // Create puzzle pieces
    function createPieces() {
        puzzleGrid.innerHTML = '';
        pieces = [];
        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.dataset.index = i;
            if (i < 8) {
                const row = Math.floor(i / 3);
                const col = i % 3;
                piece.style.backgroundImage = `url(${imagePath})`;
                piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            } else {
                piece.classList.add('blank');
            }
            pieces.push(piece);
        }
    }

    // Render the pieces in their current order
    function renderPieces() {
        puzzleGrid.innerHTML = '';
        currentOrder.forEach(index => puzzleGrid.appendChild(pieces[index]));
    }

    // Check if the puzzle is solved
    function isSolved() {
        for (let i = 0; i < currentOrder.length; i++) {
            if (currentOrder[i] !== solutionOrder[i]) {
                return false;
            }
        }
        return true;
    }

    // Handle a move
    function movePiece(piece) {
        const pieceIndex = currentOrder.indexOf(parseInt(piece.dataset.index));
        const blankIndex = currentOrder.indexOf(8);

        // Check if the clicked piece is adjacent to the blank tile
        const validMoves = [
            blankIndex - 1, blankIndex + 1,
            blankIndex - 3, blankIndex + 3
        ].filter(i => i >= 0 && i < 9);

        // Handle horizontal moves, ensuring not to wrap around rows
        if (pieceIndex === blankIndex - 1 && blankIndex % 3 !== 0) {
            validMoves.push(pieceIndex);
        }
        if (pieceIndex === blankIndex + 1 && blankIndex % 3 !== 2) {
            validMoves.push(pieceIndex);
        }

        if (validMoves.includes(pieceIndex)) {
            [currentOrder[pieceIndex], currentOrder[blankIndex]] = [currentOrder[blankIndex], currentOrder[pieceIndex]];
            renderPieces();
            if (isSolved()) {
                messageDisplay.classList.remove('hidden');
            }
        }
    }

    // Shuffle the puzzle pieces
    function shufflePieces() {
        do {
            currentOrder = [...solutionOrder];
            for (let i = currentOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentOrder[i], currentOrder[j]] = [currentOrder[j], currentOrder[i]];
            }
        } while (isSolved()); // Ensure it's not shuffled into a solved state

        renderPieces();
        messageDisplay.classList.add('hidden');
    }

    // Reset the puzzle to its solved state
    function resetPuzzle() {
        currentOrder = [...solutionOrder];
        renderPieces();
        messageDisplay.classList.add('hidden');
    }

    // Event listeners
    puzzleGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('puzzle-piece')) {
            movePiece(e.target);
        }
    });

    shuffleBtn.addEventListener('click', shufflePieces);
    resetBtn.addEventListener('click', resetPuzzle);

    // Initial setup
    createPieces();
    resetPuzzle();
});