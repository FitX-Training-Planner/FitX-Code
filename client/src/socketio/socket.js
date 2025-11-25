import { io } from "socket.io-client";

let socketInstance = null;

function getSocket(userID) {
    if (socketInstance) return socketInstance; 
    
    if (!userID) return null; 
    
    socketInstance = io(import.meta.env.VITE_API_URL, {
        query: { userID },
        transports: ["websocket", "polling"]
    });
    
    return socketInstance;
}

export default getSocket;
