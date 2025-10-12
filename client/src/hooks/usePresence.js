import { useEffect, useState } from "react";
import { useSocket } from "../app/useSocket";

export default function usePresence() {
    const socket = useSocket();

    const [onlineUsers, setOnlineUsers] = useState({});

    useEffect(() => {
        if (!socket) return;
        
        const handleOnPresence = ({ userID, status }) => {
            setOnlineUsers((prev) => ({
                ...prev,
                [String(userID)]: status === "online",
            }));
        };

        socket.on("presence_update", handleOnPresence);

        return () => {
            socket.off("presence_update", handleOnPresence);
        };
    }, [socket]);

    return onlineUsers;
}
