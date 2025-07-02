import axios from "axios";
import type { Chat } from "../types/Chat";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE = `${BASE_URL}/api/chats`;

export const fetchAllChats = async () => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.get(`${API_BASE}/`, {
      headers: {
        Authorization: token
      }
    });
    const { chats } = response.data;
    return chats as Chat[];
  } catch (error: any) {
    console.log("Error from /me authRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error fetching user.");
  }
}