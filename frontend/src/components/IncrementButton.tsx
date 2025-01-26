import { useRef, useState } from "react";
import { sendCommand } from "../utils/helper";
import { Socket } from "socket.io-client";

export const IncrementButton = ({
  property,
  text,
  socket,
}: {
  property: string;
  text: string;
  socket: Socket | null;
}) => {
  const holdIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const [held, setHeld] = useState(false);

  const handleHold = ({
    property,
    action,
  }: {
    property: string;
    action: string;
  }) => {
    if (!socket || !socket.connected) return;

    // Clear any existing interval before starting a new one
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHeld(true);
      // Set an interval to increment the volume twice per second
      holdIntervalRef.current = setInterval(() => {
        socket.emit(`${property}`, { action: `${action}` });
      }, 100);
    }, 500);
  };

  // Handle increment button hold clear
  const handleClearHold = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setTimeout(() => {
      setHeld(false);
    }, 10);
  };

  const handleClick = ({ action }: { action: string }) => {
    if (held) {
      console.log("Button is held, ignoring click");
      return;
    }
    sendCommand(`/${property}`, { action: `${action}` });
  };

  return (
    <div className="w-20 h-48 bg-[#2f3642] rounded-3xl flex flex-col justify-between items-center py-2">
      <button
        onClick={() => handleClick({ action: "up" })}
        className="size-14 text-2xl"
        onMouseDown={() => handleHold({ property, action: "up" })}
        onTouchStart={() => handleHold({ property, action: "up" })}
        onMouseUp={handleClearHold}
        onTouchEnd={handleClearHold}
      >
        {property === "volume" ? "+" : "↑"}
      </button>
      <h1 className="font-bold text-sm">{text.toUpperCase()}</h1>
      <button
        onClick={() => handleClick({ action: "down" })}
        className="size-14 text-2xl"
        onMouseDown={() => handleHold({ property, action: "down" })}
        onTouchStart={() => handleHold({ property, action: "down" })}
        onMouseUp={handleClearHold}
        onTouchEnd={handleClearHold}
      >
        {property === "volume" ? "-" : "↓"}
      </button>
    </div>
  );
};
