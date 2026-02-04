// src/pages/Setup.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImagesByCategory } from "../js/image";

/* ================= CONFIG ================= */

const CATEGORIES = ["animals", "nature", "places", "objects", "abstract"];
const DEFAULT_CATEGORY = "animals";
const PAGE_SIZE = 6;

const difficultyConfig = {
  easy: [3, 4, 5, 6],
  medium: [7, 8, 9],
  hard: [10, 11, 12],
};

/* ========= Image optimizer ========= */
const getThumbUrl = (imageUrl) =>
  imageUrl.replace(
    "/upload/",
    "/upload/w_260,h_195,c_fill,f_auto,q_auto/"
  );

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

  useEffect(() => {
    setGridSize(difficultyConfig[difficulty][0]);
  }, [difficulty]);

  useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  /* Fetch images */
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

  /* Preload */
  useEffect(() => {
    const start = (page + 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    images.slice(start, end).forEach((imgObj) => {
      const img = new Image();
      img.src = getThumbUrl(imgObj.imageUrl);
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

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <div className="lg:w-[65%]">
          <div className="flex flex-wrap gap-3 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedImage(null);
                }}
                className={`px-4 py-2 rounded-full font-semibold capitalize
                  ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-white/70"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MOBILE */}
          <div className="lg:hidden flex gap-3 overflow-x-auto">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.imageUrl)}
                className={`w-28 aspect-4/3 rounded-lg overflow-hidden
                  ${
                    selectedImage === img.imageUrl
                      ? "ring-4 ring-emerald-400"
                      : ""
                  }`}
              >
                <img
                  src={getThumbUrl(img.imageUrl)}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* DESKTOP */}
          <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-3">
            {loading &&
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-4/3 bg-slate-300 rounded-lg animate-pulse"
                />
              ))}

            {!loading &&
              visibleImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`aspect-4/3 rounded-lg overflow-hidden
                    ${
                      selectedImage === img.imageUrl
                        ? "ring-4 ring-emerald-400"
                        : ""
                    }`}
                >
                  <img
                    src={getThumbUrl(img.imageUrl)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:w-[35%]">
          <button
            onClick={startGame}
            disabled={!selectedImage}
            className="w-full py-4 rounded-xl bg-amber-400 font-bold"
          >
            Start Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
