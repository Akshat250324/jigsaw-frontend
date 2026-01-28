// src/components/PuzzleBoard.jsx

import PuzzlePiece from "./PuzzlePiece";

const PuzzleBoard = ({
  pieces,
  size,
  image,
  onPieceClick,
  selected,
  solved,
}) => {
  return (
    <div
      className="grid w-full h-full bg-white "
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {pieces.map((piece, index) => (
        <PuzzlePiece
          key={piece.id}
          piece={piece}
          index={index}
          size={size}
          image={image}
          onClick={onPieceClick}
          isSelected={selected === index}
          solved={solved}
        />
      ))}
    </div>
  );
};

export default PuzzleBoard;
