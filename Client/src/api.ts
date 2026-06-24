const isDev = import.meta.env.DEV;
const API_BASE = isDev
    ? `http://${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}/api`
    : "/api";

export const RemoteApi = {
    media: {
        toggle: () => fetch(`${API_BASE}/media/toggle`, { method: "POST" }),
        next: () => fetch(`${API_BASE}/media/next`, { method: "POST" }),
        prev: () => fetch(`${API_BASE}/media/prev`, { method: "POST" }),
    },

    audio: {
        up: () => fetch(`${API_BASE}/audio/up`, { method: "POST" }),
        down: () => fetch(`${API_BASE}/audio/down`, { method: "POST" }),
        mute: () => fetch(`${API_BASE}/audio/mute`, { method: "POST" }),
    },

    mouse: {
        click: () => fetch(`${API_BASE}/mouse/click`, { method: "POST" }),
        move: (dx: number, dy: number) =>
            fetch(`${API_BASE}/mouse/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dx, dy }),
            }),
    },

    system: {
        turnOff: () => fetch(`${API_BASE}/system/turn-off`, { method: "POST" }),
    },
};
