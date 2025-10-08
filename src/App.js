import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "winning" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
  if (winnerInfo) {
    status = "Winner: " + winnerInfo.winner;
  } else if (isDraw(squares)) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [0, 1, 2];

  return (
    <>
      <div className="status">{status}</div>
      {rows.map((row) => (
        <div className="board-row" key={row}>
          {rows.map((col) => {
            const index = row * 3 + col;
            const isWinning = winnerInfo && winnerInfo.line.includes(index);

            return (
              <Square
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                isWinning={isWinning} // ← Truyền prop
                key={col}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [isAscending, setIsAscending] = useState(true);

  function restartGame() {
    setCurrentMove(0);
    setHistory([Array(9).fill(null)]);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const previousSquares = history[move - 1];
      const changedIndex = squares.findIndex(
        (square, i) => square !== previousSquares[i]
      );

      const row = Math.floor(changedIndex / 3);
      const col = changedIndex % 3;
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          <div>You are at move #{move}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <div className="game-controls">
          <button onClick={restartGame}>Restart</button>
          <button onClick={() => setIsAscending(!isAscending)}>
            Sort: {isAscending ? "Asc" : "Desc"}
          </button>
        </div>
      </div>
      <div className="game-info">
        <h3>Move History</h3>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isDraw(squares) {
  return squares.every((square) => square !== null);
}
