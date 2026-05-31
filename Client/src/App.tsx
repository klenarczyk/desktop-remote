import {
    Pause,
    Play,
    Power,
    SkipBack,
    SkipForward,
    Volume1,
    Volume2,
    VolumeX,
} from "lucide-react";
import { RemoteApi } from "./api";
import RemoteButton from "./components/RemoteButton";
import Trackpad from "./components/Trackpad";
import useRemoteServer from "./hooks/useRemoteServer";

function App() {
    const { connection, isConnected } = useRemoteServer();

    return (
        <div className="flex flex-col h-dvh max-w-md mx-auto p-6 gap-8">
            {/* Header */}
            <header className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                    />
                    <h1 className="text-zinc-400 text-sm font-medium tracking-wider">
                        {isConnected ? "Connected" : "Connecting..."}
                    </h1>
                </div>

                <RemoteButton
                    variant="danger"
                    className="w-12 h-12 rounded-full"
                    onClick={() => RemoteApi.system.turnOff()}
                    disabled={!isConnected}
                >
                    <Power size={20} />
                </RemoteButton>
            </header>

            {/* Volume */}
            <section className="bg-zinc-900 rounded-3xl p-2 flex items-center justify-between shadow-xl shadow-black/40">
                <RemoteButton
                    variant="ghost"
                    className="h-16 flex-1"
                    onClick={() => RemoteApi.audio.down()}
                    disabled={!isConnected}
                >
                    <Volume1 size={28} />
                </RemoteButton>

                <div className="w-px h-8 bg-zinc-800" />

                <RemoteButton
                    variant="ghost"
                    className="h-16 flex-1"
                    onClick={() => RemoteApi.audio.mute()}
                    disabled={!isConnected}
                >
                    <VolumeX size={24} />
                </RemoteButton>

                <div className="w-px h-8 bg-zinc-800" />

                <RemoteButton
                    variant="ghost"
                    className="h-16 flex-1"
                    onClick={() => RemoteApi.audio.up()}
                    disabled={!isConnected}
                >
                    <Volume2 size={28} />
                </RemoteButton>
            </section>

            {/* Media */}
            <section className="grid grid-cols-3 gap-4 mt-4">
                <RemoteButton
                    className="h-24 text-zinc-400 rounded-2xl"
                    onClick={() => RemoteApi.media.prev()}
                    disabled={!isConnected}
                >
                    <SkipBack size={32} />
                </RemoteButton>

                <RemoteButton
                    className="h-24 rounded-2xl text-zinc-400"
                    onClick={() => RemoteApi.media.toggle()}
                    disabled={!isConnected}
                >
                    <div className="flex gap-1">
                        <Play size={32} fill="currentColor" />
                        <Pause size={32} fill="currentColor" />
                    </div>
                </RemoteButton>

                <RemoteButton
                    className="h-24 text-zinc-400 rounded-2xl"
                    onClick={() => RemoteApi.media.next()}
                    disabled={!isConnected}
                >
                    <SkipForward size={32} />
                </RemoteButton>
            </section>

            <section className="flex-1 my-4">
                <Trackpad connection={connection} />
            </section>
        </div>
    );
}

export default App;
