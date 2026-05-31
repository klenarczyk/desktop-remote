import type { ReactNode } from "react";

interface Props {
    onClick: () => void;
    children: ReactNode;
    variant?: "primary" | "danger" | "ghost";
    className?: string;
    disabled?: boolean;
}

export default function RemoteButton({
    onClick,
    children,
    variant = "primary",
    className = "",
    disabled = false,
}: Props) {
    const baseStyles = `flex items-center justify-center rouded-2xl transition-all duration-100 active:scale-90 touch-manipulation ${
        disabled ? "opacity-30 pointer-events-none" : "active:scale-90"
    }`;

    const variants = {
        primary:
            "bg-zinc-800 text-zinc-200 active:bg-zinc-700 shadow-lg shadow-black/20",
        danger: "bg-red-900/40 text-red-400 active:bg-red-800/60",
        ghost: "bg-transparent text-zinc-400 active:bg-zinc-800/50",
    };

    const handlePress = () => {
        if (disabled) return;
        onClick();
    };

    return (
        <button
            onClick={handlePress}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
