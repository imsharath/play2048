import { useEffect, useState } from "react";
import { game, grid, title } from "../libs/game-handler";

let _blocks = game.data();
export default function Game() {
  const [blocks, setBlocks] = useState(game.data());
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState({});

  useEffect(() => {
    window.onkeyup = (e) => {
      setBlocks(game.handleKeyPress(e, [..._blocks]));
    };

    if (localStorage)
      setBestScore(localStorage.getItem(`2048_best_score`) || 0);
  }, []);

  useEffect(() => {
    if (blocks) {
      setStatus(game.isGameOver(blocks));
      _blocks = blocks;
    }
  }, [blocks]);

  return (
    <div className="container d-flex flex-column align-items-center mx-auto">
      <div className="dashboard">
        <div className="d-flex align-items-center">
          <div className="title">{title}</div>
          <div className="d-flex align-items-center ml-auto">
            <div className="score-container">
              <div className="label">Score</div>
              <div className="score text-center">{game.score}</div>
            </div>
            <div className="score-container">
              <div className="label">Best</div>
              <div className="score text-center">
                {bestScore > game.score ? bestScore : game.score}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div
            className={`alert ${status.gameOver ? "error" : ""}${
              status.won ? "success" : ""
            }`}
          >
            {status.gameOver === true && <div>GAME OVER. PLAY AGAIN.</div>}
            {status.won === true && <div>WELL DONE. PLAY AGAIN.</div>}
          </div>
          <button
            className="button ml-auto"
            onClick={() => {
              setBlocks(game.data());
              setBestScore(game.score);
              game.reset();
            }}
          >
            New Game
          </button>
        </div>
      </div>

      <div className="game-box">
        {blocks.map((column, i) => {
          return (
            <div key={i} className="row m-0">
              {column &&
                column.map((row, j) => {
                  return (
                    <div key={j} className={`col-${12 / grid.columns} p-0`}>
                      <div
                        className={`number-block d-flex align-items-center justify-content-center block${row}`}
                      >
                        <div className="number">
                          {Number(row) === 0 ? "" : row}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
