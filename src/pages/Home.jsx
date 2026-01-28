import PuzzleSVG from "..//assets/puzzle.svg";
import { useNavigate } from "react-router-dom";

const Home = ({ onPlay }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-200 via-blue-100 to-emerald-200 px-6 relative overflow-hidden">
      {/* Decorative Puzzle - Left */}
      <img
        src={PuzzleSVG}
        alt=""
        className="absolute left-6 top-24 w-28 opacity-40 -rotate-12 hidden sm:block"
      />

      {/* Decorative Puzzle - Right */}
      <img
        src={PuzzleSVG}
        alt=""
        className="absolute right-10 top-16 w-36 opacity-50 rotate-6 hidden sm:block"
      />

      {/* Decorative Puzzle - Bottom */}
      <img
        src={PuzzleSVG}
        alt=""
        className="absolute bottom-16 right-1/3 w-24 opacity-30 rotate-12 hidden md:block"
      />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-lg">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800 mb-4">
          JigsawLab
        </h1>

        <p className="text-slate-600 text-base sm:text-lg mb-10">
          A calm and modern jigsaw puzzle game. Relax your mind and enjoy
          solving.
        </p>

        <button
          onClick={() => navigate("/setup")}
          className="px-12 py-4 rounded-2xl bg-amber-400 text-slate-900 font-bold text-lg shadow-lg hover:bg-amber-300 hover:scale-105 transition-all"
        >
          Play Now
        </button>

        <p className="mt-14 text-xs text-slate-500">© 2025 JigsawLab</p>
      </div>
    </div>
  );
};

export default Home;
