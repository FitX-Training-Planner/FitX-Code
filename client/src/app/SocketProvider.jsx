
import { useEffect, useState } from "react";
import SocketContext from "./SocketContext";
import getSocket from "../socketio/socket";

export const SocketProvider = ({ 
    userID, 
    children 
}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!userID || socket) return;

        const newSocket = getSocket(userID);

        setSocket(newSocket);

        return () => {
            if (socket) newSocket.disconnect();
        };
    }, [socket, userID]);

    return (
        <SocketContext.Provider 
            value={socket}
        >
            {children}
        </SocketContext.Provider>
    );
};
