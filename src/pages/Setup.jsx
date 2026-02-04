// src/pages/Setup.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImagesByCategory } from "../js/image";

/* ================= CONFIG ================= */

const CATEGORIES = ["animals", "nature", "places", "objects", "abstract"];
const DEFAULT_CATEGORY = "animals";

/* Desktop grid: 2 rows × 3 columns */
const PAGE_SIZE = 6;

const difficultyConfig = {
  easy: [3, 4, 5, 6],
  medium: [7, 8, 9],
  hard: [10, 11, 12],
};

/* ========= Image optimizer ========= */
const getThumbUrl = (url) =>
  url.replace("/upload/", "/upload/w_260,h_195,c_fill,f_auto,q_auto/"); // 4:3

const Setup = () => {
  const navigate = useNavigate();
  const cacheRef = useRef({});

  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [difficulty, setDifficulty] = useState("easy");
  const [gridSize, setGridSize] = useState(3);
  const [selectedImage, setSelectedImage] = useState(null);

  const [page, setPage] = useState(0);

  /* Sync grid size with difficulty */
  useEffect(() => {
    setGridSize(difficultyConfig[difficulty][0]);
  }, [difficulty]);

  /* Reset page on category change */
  useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  /* Fetch images with cache */
  useEffect(() => {
    if (cacheRef.current[activeCategory]) {
      setImages(cacheRef.current[activeCategory]);
      return;
    }

    setLoading(true);
    getImagesByCategory(activeCategory)
      .then((data) => {
        cacheRef.current[activeCategory] = data;
        setImages(data);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  /* Preload next page images */
  useEffect(() => {
    const nextPage = page + 1;
    const start = nextPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    images.slice(start, end).forEach((url) => {
      const img = new Image();
      img.src = getThumbUrl(url);
    });
  }, [page, images]);

  const totalPages = Math.ceil(images.length / PAGE_SIZE);
  const visibleImages = images.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const startGame = () => {
    if (!selectedImage) return;

    navigate("/game", {
      state: { image: selectedImage, gridSize, difficulty },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-200 via-blue-100 to-emerald-200 px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-8">
        Game Setup
      </h1>

      {/* ================= MAIN ================= */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* ================= LEFT ================= */}
        <div className="lg:w-[65%] flex flex-col">
          <p className="font-semibold text-slate-700 mb-4">
            Choose Puzzle Image
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedImage(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition
                  ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-white/70 text-slate-700 hover:bg-white"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MOBILE / TABLET SLIDER */}
          <div className="lg:hidden flex gap-3 overflow-x-auto py-2 scrollbar-hide">
            {images.map((url) => (
              <button
                key={url}
                onClick={() => setSelectedImage(url)}
                className={`flex-none w-28 aspect-4/3 rounded-lg overflow-hidden transition
                  ${
                    selectedImage === url
                      ? "ring-4 ring-emerald-400"
                      : "hover:scale-[1.05]"
                  }
                `}
              >
                <img
                  src={getThumbUrl(url)}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 grid-rows-2 gap-3">
              {loading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-4/3 bg-slate-300 rounded-lg animate-pulse"
                  />
                ))}

              {!loading &&
                visibleImages.map((url) => (
                  <button
                    key={url}
                    onClick={() => setSelectedImage(url)}
                    className={`aspect-4/3 rounded-lg overflow-hidden transition
                      ${
                        selectedImage === url
                          ? "ring-4 ring-emerald-400"
                          : "hover:scale-[1.05]"
                      }
                    `}
                  >
                    <img
                      src={getThumbUrl(url)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>

            {/* Pagination */}
            {images.length > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50"
                >
                  ◀ Prev
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-2.5 h-2.5 rounded-full
                        ${page === i ? "bg-slate-800" : "bg-slate-400"}
                      `}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setPage(Math.min(totalPages - 1, page + 1))
                  }
                  disabled={page === totalPages - 1}
                  className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50"
                >
                  Next ▶
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="lg:w-[35%] max-w-[420px] w-full rounded-2xl p-6 shadow-sm flex flex-col gap-6 bg-transparent lg:bg-white/60">
          {/* Difficulty */}
          <div>
            <p className="font-semibold text-slate-700 mb-3">Difficulty</p>
            <div className="flex gap-2 flex-wrap">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-full font-semibold capitalize transition
                    ${
                      difficulty === level
                        ? "bg-amber-400"
                        : "bg-white/70 hover:bg-white"
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Size */}
          <div>
            <p className="font-semibold text-slate-700 mb-3">Grid Size</p>
            <div className="grid grid-cols-3 gap-2">
              {difficultyConfig[difficulty].map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`py-2 rounded-lg font-bold transition
                    ${
                      gridSize === size
                        ? "bg-amber-400"
                        : "bg-white/70 hover:bg-white"
                    }
                  `}
                >
                  {size} × {size}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-xl bg-white/50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">How to play</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Select an image</li>
              <li>Choose difficulty & grid size</li>
              <li>Arrange pieces to complete the puzzle</li>
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            disabled={!selectedImage}
            className="mt-2 w-full py-4 rounded-xl bg-amber-400 font-bold
                       hover:bg-amber-300 disabled:opacity-50"
          >
            Start Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
