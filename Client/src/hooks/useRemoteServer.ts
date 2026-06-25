import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getDeviceId } from "../utils/auth";

const isDev = import.meta.env.DEV;
const HUB_URL = isDev
    ? `http://${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT}/remoteHub?deviceId=${getDeviceId()}`
    : `/remoteHub?deviceId=${getDeviceId()}`;

export default function useRemoteServer(shouldConnect: boolean) {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null,
    );
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!shouldConnect) return;

        let isMounted = true;

        const newConn = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .build();

        newConn
            .start()
            .then(() => {
                if (isMounted) {
                    setConnection(newConn);
                    setIsConnected(true);
                }
            })
            .catch((err) => {
                console.error("SignalR Connection Error: ", err);
            });

        newConn.onreconnecting(() => setIsConnected(false));
        newConn.onreconnected(() => setIsConnected(true));
        newConn.onclose(() => setIsConnected(false));

        return () => {
            isMounted = false;
            newConn.stop();
            setIsConnected(false);
        };
    }, [shouldConnect]);

    return { connection, isConnected };
}
