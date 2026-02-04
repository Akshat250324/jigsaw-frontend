import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

import PuzzleBoard from "../components/PuzzleBoard";
import { createPuzzle, isSolved } from "../utils/puzzleUtils";

const Game = () => {
  const { state } = useLocation();

  /* ---------- HARD ROUTE GUARD (SAFE) ---------- */
  if (!state || !state.image || !state.gridSize) {
    return <Navigate to="/setup" replace />;
  }

  const { image, gridSize, difficulty } = state;


  /* ---------- Puzzle State ---------- */
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);

  /* ---------- Stats ---------- */
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);

  /* ---------- Reference Modal ---------- */
  const [showReference, setShowReference] = useState(false);

  /* ---------- Init Puzzle ---------- */
  useEffect(() => {
    setPieces(createPuzzle(gridSize));
    setSelected(null);
    setSolved(false);
    setMoves(0);
    setSeconds(0);
  }, [gridSize, image]);

  /* ---------- Timer ---------- */
  useEffect(() => {
    if (solved) return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [solved]);

  const formatTime = () => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ---------- Piece Interaction ---------- */
  const handlePieceClick = (index) => {
    if (solved) return;

    if (selected === null) {
      setSelected(index);
      return;
    }

    if (selected !== index) {
      const updated = [...pieces];
      [updated[selected], updated[index]] = [
        updated[index],
        updated[selected],
      ];
      setPieces(updated);
      setMoves((m) => m + 1);
    }

    setSelected(null);
  };

  /* ---------- Solve Check ---------- */
  useEffect(() => {
    if (pieces.length && isSolved(pieces)) {
      setSolved(true);
    }
  }, [pieces]);

  /* ---------- Shuffle ---------- */
  const shufflePuzzle = () => {
    setPieces(createPuzzle(gridSize));
    setSelected(null);
    setSolved(false);
    setMoves(0);
    setSeconds(0);
  };

  /* ---------- Responsive Board Size ---------- */
  const boardStyle = {
    width: "min(92vw, 78vh, 560px)",
    height: "min(92vw, 78vh, 560px)",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-200 via-blue-100 to-emerald-200 px-4 py-6">
      {/* ================= TOP BAR ================= */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-6 text-slate-700">
        <button onClick={() => navigate("/setup")}>← Setup</button>
        <div className="font-mono">{formatTime()}</div>
        <button onClick={shufflePuzzle}>🔀 Shuffle</button>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center lg:items-start justify-center">
        {/* -------- Puzzle Board -------- */}
        <div className="flex justify-center">
          <div
            style={boardStyle}
            className="bg-white border border-slate-300 shadow-md"
          >
            <PuzzleBoard
              pieces={pieces}
              size={gridSize}
              image={image}
              selected={selected}
              onPieceClick={handlePieceClick}
              solved={solved}
            />
          </div>
        </div>

        {/* -------- Side Panel -------- */}
        <div className="w-full lg:w-[280px] flex flex-col gap-6">
          <div className="flex justify-between bg-white/70 rounded-xl p-3 shadow-sm">
            <button onClick={() => setShowReference(true)}>🖼 Reference</button>
            <div className="font-mono">{formatTime()}</div>
          </div>

          <div className="bg-white/70 rounded-xl p-4 text-sm space-y-2">
            <div>
              <strong>Difficulty:</strong> {difficulty}
            </div>
            <div>
              <strong>Grid:</strong> {gridSize} × {gridSize}
            </div>
            <div>
              <strong>Moves:</strong> {moves}
            </div>
          </div>

          {!solved && (
            <p className="text-sm text-slate-600 text-center">
              Tap or drag pieces to swap and complete the puzzle.
            </p>
          )}

          {solved && (
            <div className="bg-emerald-500/20 rounded-xl p-4 text-center">
              <p className="font-bold text-emerald-700 mb-2">
                🎉 Puzzle Completed!
              </p>
              <p className="text-sm mb-4">
                Time: <strong>{formatTime()}</strong>
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={shufflePuzzle}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg"
                >
                  Restart
                </button>
                <button
                  onClick={() => navigate("/setup")}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  Change Puzzle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= REFERENCE MODAL ================= */}
      {showReference && (
        <div
          onClick={() => setShowReference(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <img
            src={image}
            alt="Reference"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Game;
