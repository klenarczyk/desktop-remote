import { useState } from "react";

const RemoteInput = ({ socket }) => {
  const [input, setInput] = useState("");
  const pressedKeys = new Set();
  const specialKeys = [
    "Backspace",
    "Enter",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ];

  const handleKeyDown = (e) => {
    if (!pressedKeys.has(e.key)) {
      if (specialKeys.includes(e.key)) {
        socket.emit("input", { text: `{${e.key.toLowerCase()}}` });
        pressedKeys.add(e.key);
      }
    }
    if (!specialKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleKeyUp = (e) => {
    pressedKeys.delete(e.key);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (!specialKeys.includes(text)) {
      if (text !== "") {
        socket.emit("input", { text });
      }
    }
    setInput(""); // Clear input field
  };

  return (
    <div className="size-16 bg-[#2f3642] rounded-3xl flex justify-center items-center py-2 relative">
      <h1 className="font-bold text-sm">TEXT</h1>

      {/* Hidden input field */}
      <input
        type="text"
        value={input}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onChange={handleInputChange}
        placeholder="Type here..."
        className="absolute top-0 left-0 w-full h-full opacity-0 z-10"
        autoFocus
      />
    </div>
  );
};

export default RemoteInput;
