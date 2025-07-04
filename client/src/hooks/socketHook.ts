import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("SocketContext not found!");
    }
    return context;
}

export default useSocket;