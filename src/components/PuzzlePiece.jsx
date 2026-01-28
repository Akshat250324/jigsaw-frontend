const PuzzlePiece = ({
  piece,
  index,
  size,
  image,
  onClick,
  isSelected,
  solved,
}) => {
  const row = Math.floor(piece.correctIndex / size);
  const col = piece.correctIndex % size;

  return (
    <div
      onClick={() => onClick(index)}
      className={`w-full h-full cursor-pointer ${
        isSelected ? "ring-2 ring-amber-400" : ""
      }`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: `${size * 100}% ${size * 100}%`,
        backgroundPosition: `${(col * 100) / (size - 1)}% ${
          (row * 100) / (size - 1)
        }%`,
        backgroundRepeat: "no-repeat",

        /* ✅ THIS IS IMPORTANT */
        boxShadow: solved ? "none" : "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
      }}
    />
  );
};

export default PuzzlePiece;
