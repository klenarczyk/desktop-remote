import { useRef, useState } from "react";
import { RemoteApi } from "../api";

interface DevicePairingProps {
    onSuccess: () => void;
}

export default function DevicePairing({ onSuccess }: DevicePairingProps) {
    const [pinSlots, setPinSlots] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handlePair = async (pin: string) => {
        const res = await RemoteApi.system.pair(pin);

        if (res.ok) {
            setError("");
            onSuccess();
        } else {
            setError("Incorrect PIN");
            setPinSlots(["", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    };

    const handleChange = (idx: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        if (!digit && value !== "") return;

        const newSlots = [...pinSlots];
        newSlots[idx] = digit;
        setPinSlots(newSlots);

        if (digit && idx < 3) {
            inputRefs.current[idx + 1]?.focus();
        }

        if (digit && idx === 3) {
            handlePair(newSlots.join(""));
        }
    };

    const handleKeyDown = (
        idx: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key !== "Backspace") return;

        if (!pinSlots[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
            return;
        }

        const newSlots = [...pinSlots];
        newSlots[idx] = "";
        setPinSlots(newSlots);
    };

    return (
        <div className="fixed inset-0 min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 z-50">
            <h1 className="text-2xl font-bold text-zinc-200 mb-2">
                Device Pairing
            </h1>
            <p className="text-zinc-500 text-center mb-8">
                Enter the PIN displayed on your PC.
            </p>

            <div className="flex gap-4 mb-8">
                {pinSlots.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={(el) => {
                            inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={2}
                        value={digit}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-16 h-20 bg-zinc-900 border-2 border-zinc-800 focus:border-emerald-500 
                            rounded-2xl text-center text-4xl font-mono text-zinc-200 
                            outline-none transition-all shadow-xl shadow-black/20"
                    />
                ))}
            </div>

            <div className="h-6">
                {error && <p className="text-red-400 font-medium">{error}</p>}
            </div>
        </div>
    );
}
