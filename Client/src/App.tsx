import {
    Bookmark,
    Minimize,
    Pause,
    Play,
    Power,
    RotateCcw,
    RotateCw,
    Undo2,
    Volume1,
    Volume2,
    VolumeX,
} from "lucide-react";
import { RemoteApi } from "./api";
import RemoteButton from "./components/RemoteButton";
import Trackpad from "./components/Trackpad";
import useRemoteServer from "./hooks/useRemoteServer";
import Keyboard from "./components/Keyboard";
import { useEffect, useState } from "react";
import DevicePairing from "./components/DevicePairing";

function App() {
    const { connection, isConnected } = useRemoteServer();

    const [isPinging, setIsPinging] = useState(true);
    const [isAuthorized, setisAuthorized] = useState(false);

    useEffect(() => {
        RemoteApi.ping()
            .then((res) => {
                if (res.status === 401) {
                    setisAuthorized(false);
                } else {
                    setisAuthorized(true);
                }
            })
            .catch(() => {
                // Network error, show the default UI
                setisAuthorized(true);
            })
            .finally(() => setIsPinging(false));
    }, []);

    const sendKey = (key: string) => {
        if (!connection) return;
        connection.invoke("TypeText", key).catch(console.error);
    };

    if (isPinging) {
        return (
            <div className="fixed inset-0 min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 z-50">
                <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-zinc-500"></span>
                </div>
                <p className="text-zinc-500 text-sm font-medium tracking-widest">
                    Checking in with the server
                </p>
            </div>
        );
    }

    if (!isAuthorized) {
        return <DevicePairing onSuccess={() => setisAuthorized(true)} />;
    }

    return (
        <div className="flex flex-col h-dvh max-w-md mx-auto p-6 gap-6">
            {/* Header */}
            <header className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                    />
                    <h1 className="text-zinc-400 text-sm font-medium tracking-wider">
                        {isConnected ? "Connected" : "Connecting..."}
                    </h1>
                </div>

                <div className="flex gap-2">
                    <RemoteButton
                        variant="ghost"
                        className="w-12 h-12 rounded-full border border-zinc-800"
                        onClick={() => alert("TODO: Open Saved Sites Modal")}
                        disabled={!isConnected}
                    >
                        <Bookmark size={20} className="text-zinc-400" />
                    </RemoteButton>

                    <RemoteButton
                        variant="danger"
                        className="w-12 h-12 rounded-full"
                        onClick={() => RemoteApi.system.turnOff()}
                        disabled={!isConnected}
                    >
                        <Power size={20} />
                    </RemoteButton>
                </div>
            </header>

            {/* Media */}
            <section className="flex flex-col gap-4 mt-2">
                {/* Volume */}
                <section className="bg-zinc-900 rounded-full p-1 flex items-center justify-between shadow-lg shadow-black/20 border border-zinc-800/50">
                    <RemoteButton
                        variant="ghost"
                        className="h-12 flex-1 rounded-full"
                        onClick={() => RemoteApi.audio.down()}
                        disabled={!isConnected}
                    >
                        <Volume1 size={24} className="text-zinc-400" />
                    </RemoteButton>

                    <div className="w-px h-6 bg-zinc-800" />

                    <RemoteButton
                        variant="ghost"
                        className="h-12 flex-1 rounded-full"
                        onClick={() => RemoteApi.audio.mute()}
                        disabled={!isConnected}
                    >
                        <VolumeX size={20} className="text-zinc-500" />
                    </RemoteButton>

                    <div className="w-px h-6 bg-zinc-800" />

                    <RemoteButton
                        variant="ghost"
                        className="h-12 flex-1 rounded-full"
                        onClick={() => RemoteApi.audio.up()}
                        disabled={!isConnected}
                    >
                        <Volume2 size={24} className="text-zinc-400" />
                    </RemoteButton>
                </section>

                {/* Media controls */}
                <section className="grid grid-cols-3 gap-3">
                    <RemoteButton
                        className="h-20 text-zinc-400 bg-zinc-900 rounded-3xl border border-zinc-800/50"
                        onClick={() => sendKey("{LEFT}")}
                        disabled={!isConnected}
                    >
                        <RotateCcw size={24} />
                    </RemoteButton>

                    <RemoteButton
                        className="h-20 bg-zinc-900 text-zinc-500 rounded-3xl"
                        onClick={() => RemoteApi.media.toggle()}
                        disabled={!isConnected}
                    >
                        <div className="flex gap-1">
                            <Play size={28} fill="currentColor" />
                            <Pause size={28} fill="currentColor" />
                        </div>
                    </RemoteButton>

                    <RemoteButton
                        className="h-20 text-zinc-400 bg-zinc-900 rounded-3xl border border-zinc-800/50"
                        onClick={() => sendKey("{RIGHT}")}
                        disabled={!isConnected}
                    >
                        <RotateCw size={24} />
                    </RemoteButton>
                </section>
            </section>

            {/* Toolbar */}
            <section className="flex gap-2 mt-4">
                <RemoteButton
                    variant="ghost"
                    className="h-14 flex-1 bg-zinc-900 rounded-2xl border border-zinc-800/50"
                    onClick={() => sendKey("{BROWSER_BACK}")}
                    disabled={!isConnected}
                >
                    <Undo2 size={22} className="text-zinc-400" />
                </RemoteButton>

                <RemoteButton
                    variant="ghost"
                    className="h-14 flex-1 bg-zinc-900 rounded-2xl border border-zinc-800/50"
                    onClick={() => sendKey("{ESC}")}
                    disabled={!isConnected}
                >
                    <Minimize size={22} className="text-zinc-400" />
                </RemoteButton>

                <Keyboard
                    connection={connection}
                    disabled={!isConnected}
                    className="h-14 flex-1 bg-zinc-900 rounded-2xl border border-zinc-800/50"
                />
            </section>

            {/* Trackpad */}
            <section className="flex-1 mb-2">
                <Trackpad connection={connection} />
            </section>
        </div>
    );
}

export default App;
