import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext not found!");
    }
    return context;
}

export default useAuth;