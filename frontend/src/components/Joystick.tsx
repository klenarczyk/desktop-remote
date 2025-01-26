import { useRef, useState } from "react";
import { sendCommand } from "../utils/helper";

export const Joystick = ({ onMove, onStop }) => {
  const joystickRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleStart = (e) => {
    const touch = e.touches?.[0] || e;
    if (joystickRef.current) {
      joystickRef.current.startX = touch.clientX;
      joystickRef.current.startY = touch.clientY;
    }
  };

  const handleMove = (e) => {
    const touch = e.touches?.[0] || e;
    if (!joystickRef.current) return;
    const deltaX = touch.clientX - joystickRef.current.startX;
    const deltaY = touch.clientY - joystickRef.current.startY;

    const distance = Math.min(100 / 2, Math.sqrt(deltaX ** 2 + deltaY ** 2));
    const angle = Math.atan2(deltaY, deltaX);

    const x = (Math.cos(angle) * distance) / 2;
    const y = (Math.sin(angle) * distance) / 2;

    setPosition({ x, y });
    if (onMove) {
      onMove({ x, y });
    }
  };

  const handleStop = () => {
    setPosition({ x: 0, y: 0 });
    if (onStop) {
      onStop();
    }
  };

  return (
    <div
      ref={joystickRef}
      className="relative size-44 bg-[#2f3642] rounded-full touch-none"
      onMouseDown={handleStart}
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onMouseUp={handleStop}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleStop}
    >
      <img
        src="/icons/chevron-right.svg"
        className="filter invert-[80%] size-3 absolute top-1/2 left-2 transform -translate-y-1/2 rotate-180"
      />
      <img
        src="/icons/chevron-right.svg"
        className="filter invert-[80%] size-3 absolute top-2 left-1/2 transform -translate-x-1/2 -rotate-90"
      />
      <img
        src="/icons/chevron-right.svg"
        className="filter invert-[80%] size-3 absolute top-1/2 right-2 transform -translate-y-1/2"
      />
      <img
        src="/icons/chevron-right.svg"
        className="filter invert-[80%] size-3 absolute bottom-2 left-1/2 transform -translate-x-1/2 rotate-90"
      />
      <div
      onClick={() => sendCommand("/left_click", {})}
        className="absolute size-28 rounded-full bg-gradient-to-tr from-[#7464e3] to-[#8c77f3]"
        style={{
          left: `calc(50% + ${position.x}px - 56px)`,
          top: `calc(50% + ${position.y}px - 56px)`,
        }}
      />
    </div>
  );
};
