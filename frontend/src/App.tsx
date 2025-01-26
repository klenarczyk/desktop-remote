import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Joystick } from "./components/Joystick";
import { IncrementButton } from "./components/IncrementButton";
import { Button } from "./components/Button";
import { Shortcut } from "./components/Shortcut";
import RemoteInput from "./components/RemoteInput";

function App() {
  const hostIpv4 = import.meta.env.VITE_HOST_IPV4;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to the Flask server via Socket.IO
    const ws = io(`${hostIpv4}:5000`, {
      transports: ["websocket"],
    });

    ws.on("connect", () => {
      console.log("Connected to Flask-SocketIO server");
    });

    ws.on("mouse_moved", (data) => {
      console.log("Mouse move response:", data);
    });

    setSocket(ws);

    // Cleanup when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Handle joystick movement
  const handleMove = (e) => {
    const { x, y } = e;
    if (!socket || !socket.connected) return;

    // Emit the move_mouse event to Flask backend
    socket.emit("move_mouse", { deltaX: x, deltaY: y });
  };

  // Handle joystick stop
  const handleStop = () => {
    if (socket && socket.connected) {
      // Emit the stop event (zero movement)
      socket.emit("move_mouse", { deltaX: 0, deltaY: 0 });
    }
  };

  return (
    <main className="relative h-[100dvh] w-screen flex flex-col items-center bg-[#202732] pb-10">
      <div className="flex h-14 justify-center items-center select-none">
        <span className="font-bold text-[#a6acb8] tracking-[1em]">R</span>
        <span className="font-bold text-[#a6acb8] tracking-[1em]">E</span>
        <span className="font-bold text-[#a6acb8] tracking-[1em]">M</span>
        <span className="font-bold text-[#a6acb8] tracking-[1em]">O</span>
        <span className="font-bold text-[#a6acb8] tracking-[1em]">T</span>
        <span className="font-bold text-[#a6acb8]">E</span>
      </div>

      {/* Shortcuts */}
      <div className="flex justify-center items-center gap-8 h-10 my-5">
        <Shortcut app="netflix" />
        <Shortcut app="disney" />
        <Shortcut app="prime" />
        <Shortcut app="youtube" />
      </div>

      {/* Buttons for controlling various actions */}
      <div className="flex items-center justify-center space-x-12 w-full px-10 select-none my-5">
        <IncrementButton property="volume" text="vol" socket={socket} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Button property="fullscreen" text={null} icon action={null} />
          <Button property="volume" text={null} icon action={"mute"} />
          <Button property="return" text={null} icon action={null} />
        </div>
        <IncrementButton property="navigation" text="nav" socket={socket} />
      </div>

      {/* Mouse Movements and other actions */}
      <div className="relative flex items-center justify-center w-full min-h-72 select-none">
        <div className="h-full py-5 flex flex-col items-center justify-between">
          <Button property="backwards" text={null} icon action={null} />
          <RemoteInput socket={socket} />
        </div>
        <div className="min-w-44">
          <Joystick onMove={handleMove} onStop={handleStop} />
        </div>
        <div className="h-full py-5 flex flex-col items-center justify-between">
          <Button property="forwards" text={null} icon action={null} />
          <Button property="pause" text={null} icon action={null} />
        </div>
      </div>

      <div className="absolute bottom-2 text-sm text-[#535963]">
        ©2024 | Krzysztof Lenarczyk
      </div>
    </main>
  );
}

export default App;
