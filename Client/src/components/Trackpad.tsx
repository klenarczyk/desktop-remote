import * as signalR from "@microsoft/signalr";
import { MousePointer2 } from "lucide-react";
import { useRef, type TouchEvent } from "react";

interface TrackpadProps {
    connection: signalR.HubConnection | null;
}

export default function Trackpad({ connection }: TrackpadProps) {
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const SENSITIVITY = 1.5;

    const handleTouchStart = (e: TouchEvent) => {
        lastPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!lastPos.current || !connection) return;

        const currX = e.touches[0].clientX;
        const currY = e.touches[0].clientY;

        const dx = Math.round((currX - lastPos.current.x) * SENSITIVITY);
        const dy = Math.round((currY - lastPos.current.y) * SENSITIVITY);

        if (dx !== 0 || dy !== 0) {
            connection.invoke("MoveMouse", dx, dy).catch(console.error);
            lastPos.current = { x: currX, y: currY };
        }
    };

    const handleTouchEnd = () => {
        lastPos.current = null;
    };

    return (
        <div
            className={`h-full w-full rounded-3xl bg-zinc-900 border-zinc-800/50 border flex flex-col items-center justify-center relative overflow-hidden touch-none
                ${!connection ? "opacity-30" : ""}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <MousePointer2
                size={36}
                className="text-zinc-700 mb-4 pointer-events-none"
            />
        </div>
    );
}
