const IP = import.meta.env.VITE_HOST_IPV4;
const API_BASE = `http://${IP}:7546/api`;

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
};
