import * as signalR from "@microsoft/signalr";
import { MousePointer2 } from "lucide-react";
import { useRef, type TouchEvent } from "react";

interface TrackpadProps {
    connection: signalR.HubConnection | null;
}

export default function Trackpad({ connection }: TrackpadProps) {
    const MOUSE_SENSITIVITY = 1.5;
    const SCROLL_SENSITIVITY = 2.5;

    const startPos = useRef<{ x: number; y: number } | null>(null);
    const lastPos = useRef<{ x: number; y: number } | null>(null);

    const touchStartTime = useRef<number>(0);
    const maxFingers = useRef<number>(0);

    const handleTouchStart = (e: TouchEvent) => {
        touchStartTime.current = Date.now();
        maxFingers.current = e.touches.length;

        startPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };

        lastPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > maxFingers.current) {
            maxFingers.current = e.touches.length;
        }

        if (!lastPos.current || !connection) return;

        const currX = e.touches[0].clientX;
        const currY = e.touches[0].clientY;

        // Move Mouse
        if (e.touches.length === 1) {
            const dx = Math.round(
                (currX - lastPos.current.x) * MOUSE_SENSITIVITY,
            );
            const dy = Math.round(
                (currY - lastPos.current.y) * MOUSE_SENSITIVITY,
            );

            if (dx !== 0 || dy !== 0) {
                connection.invoke("MoveMouse", dx, dy).catch(console.error);
                lastPos.current = { x: currX, y: currY };
            }
        }
        // Scroll
        else if (e.touches.length === 2) {
            const dy = Math.round(
                (currY - lastPos.current.y) * SCROLL_SENSITIVITY,
            );

            if (dy !== 0) {
                connection.invoke("Scroll", dy).catch(console.error);
                lastPos.current = { x: currX, y: currY };
            }
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        lastPos.current = null;

        if (!startPos.current || !connection) return;

        const tapDuration = Date.now() - touchStartTime.current;
        const TAP_THRESHOLD_MS = 250;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const drift = Math.sqrt(
            Math.pow(endX - startPos.current.x, 2) +
                Math.pow(endY - startPos.current.y, 2),
        );
        const DRIFT_THRESHOLD_PX = 10;

        if (tapDuration < TAP_THRESHOLD_MS && drift < DRIFT_THRESHOLD_PX) {
            const command =
                maxFingers.current === 1 ? "LeftClick" : "RightClick";
            connection.invoke(command).catch(console.error);
        }

        startPos.current = null;
        maxFingers.current = 0;
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
