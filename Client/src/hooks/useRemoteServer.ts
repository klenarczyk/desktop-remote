import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const isDev = import.meta.env.DEV;
const HUB_URL = isDev
    ? `http://${window.location.hostname}:7546/remoteHub`
    : "/remoteHub";

export default function useRemoteServer() {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null,
    );
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
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
    }, []);

    return { connection, isConnected };
}
