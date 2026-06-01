import * as signalR from "@microsoft/signalr";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import RemoteButton from "./RemoteButton";
import { KeyboardIcon } from "lucide-react";

interface KeyboardProps {
    connection: signalR.HubConnection | null;
    disabled: boolean;
    className?: string;
}

export default function Keyboard({
    connection,
    disabled,
    className,
}: KeyboardProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(" "); // Dummy space to handle backspace

    const summonKeyboard = () => {
        if (disabled || !inputRef.current) return;
        inputRef.current.focus();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!connection) return;

        const newVal = e.target.value;

        if (newVal.length < inputValue.length) {
            connection.invoke("TypeText", "{BACKSPACE}").catch(console.error);
        } else if (newVal.length > inputValue.length) {
            const newText = newVal.slice(inputValue.length);
            connection.invoke("TypeText", newText).catch(console.error);
        }

        if (newVal === "") {
            setInputValue(" ");
        } else {
            setInputValue(newVal);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter" && connection) {
            connection.invoke("TypeText", "{ENTER}").catch(console.error);
        }
    };

    return (
        <>
            {/* Invisible input */}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="opacity-0 absolute -z-10 w-px h-px caret-transparent overflow-hidden"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            />

            <RemoteButton
                variant="ghost"
                className={className}
                disabled={disabled}
                onClick={summonKeyboard}
            >
                <KeyboardIcon size={20} className="text-zinc-400" />
            </RemoteButton>
        </>
    );
}
