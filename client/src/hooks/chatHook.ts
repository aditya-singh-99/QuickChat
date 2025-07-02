import { useContext } from "react";
import { ChatContext } from "../contexts/chatContext";

const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("ChatContext not found!");
    }
    return context;
}

export default useChat;