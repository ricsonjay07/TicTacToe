import { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function calculateWinner(squares) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  const draw = !winner && squares.every(Boolean);
  const status = winner ? 'Winner: ' + winner : draw ? 'Draw!' : 'Next player: ' + (xIsNext ? 'X' : 'O');
  return (
    <>
      <div className="status">{status}</div>
      {[0,1,2].map(row => (
        <div className="board-row" key={row}>
          {[0,1,2].map(col => {
            const i = row * 3 + col;
            return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />;
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) { setCurrentMove(nextMove); }

  const moves = history.map((squares, move) => (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>
        {move > 0 ? 'Go to move #' + move : 'Go to game start'}
      </button>
    </li>
  ));

  return (
    <main className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-board"><Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /></div>
      <section className="game-info">
        <h2>Move History</h2>
        <ol>{moves}</ol>
      </section>
    </main>
  );
}
