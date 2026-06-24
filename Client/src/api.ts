import { getDeviceId } from "./utils/auth";

const isDev = import.meta.env.DEV;
const API_BASE = isDev
    ? `http://${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}/api`
    : "/api";

const getHeaders = () => ({
    "Content-Type": "application/json",
    "X-Device-Id": getDeviceId(),
});

export const RemoteApi = {
    media: {
        toggle: () =>
            fetch(`${API_BASE}/media/toggle`, {
                method: "POST",
                headers: getHeaders(),
            }),
        next: () =>
            fetch(`${API_BASE}/media/next`, {
                method: "POST",
                headers: getHeaders(),
            }),
        prev: () =>
            fetch(`${API_BASE}/media/prev`, {
                method: "POST",
                headers: getHeaders(),
            }),
    },

    audio: {
        up: () =>
            fetch(`${API_BASE}/audio/up`, {
                method: "POST",
                headers: getHeaders(),
            }),
        down: () =>
            fetch(`${API_BASE}/audio/down`, {
                method: "POST",
                headers: getHeaders(),
            }),
        mute: () =>
            fetch(`${API_BASE}/audio/mute`, {
                method: "POST",
                headers: getHeaders(),
            }),
    },

    mouse: {
        click: () =>
            fetch(`${API_BASE}/mouse/click`, {
                method: "POST",
                headers: getHeaders(),
            }),
        move: (dx: number, dy: number) =>
            fetch(`${API_BASE}/mouse/move`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ dx, dy }),
            }),
    },

    system: {
        turnOff: () =>
            fetch(`${API_BASE}/system/turn-off`, {
                method: "POST",
                headers: getHeaders(),
            }),

        pair: (pin: string) =>
            fetch(`${API_BASE}/system/pair`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ deviceId: getDeviceId(), pin }),
            }),
    },

    ping: () => fetch(`${API_BASE}/ping`, { headers: getHeaders() }),
};
