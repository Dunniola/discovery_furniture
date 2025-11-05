import React, { useState } from "react";

const ColourSleuth = ({ onColorSelect }) => {
  const colors = ["#030616", "#8d2726", "#fcff53"];

  const [mainColor, setMainColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
  );
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState(
    [...colors].sort(() => Math.random() - 0.5)
  );

  const handleChoice = (color) => {
    if (color === mainColor) {
      setMessage("🎉 Correct!");
      if (onColorSelect) onColorSelect(color); // Pass color to parent
    } else {
      setMessage("❌ Try again!");
    }
  };

  const newRound = () => {
    const newMain = colors[Math.floor(Math.random() * colors.length)];
    setMainColor(newMain);
    setOptions([...colors].sort(() => Math.random() - 0.5));
    setMessage("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 mt-10" style={{ color: colors[0] }}>
        Colour Sleuth
      </h2>

      <div
        className="w-40 h-40 mx-auto rounded-lg mb-6 shadow-lg"
        style={{ backgroundColor: mainColor, border: `3px solid ${colors[1]}` }}
      ></div>

      <div className="flex justify-center gap-4 mb-4">
        {options.map((color, i) => (
          <button
            key={i}
            onClick={() => handleChoice(color)}
            className="w-16 h-16 rounded-full shadow-lg"
            style={{ backgroundColor: color, border: `2px solid ${colors[0]}` }}
          ></button>
        ))}
      </div>

      <p className="text-lg text-center mb-4" style={{ color: colors[2] }}>
        {message}
      </p>

      <button
        onClick={newRound}
        className="px-4 py-2 rounded font-semibold"
        style={{ backgroundColor: colors[1], color: colors[2] }}
      >
        New Round
      </button>
    </div>
  );
};

export default ColourSleuth;
