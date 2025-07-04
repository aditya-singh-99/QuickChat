import axios from "axios";
import type { Message } from "../types/Message";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE = `${BASE_URL}/api/messages`;

export const sendMessage = async (content: string, chatId: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.post(`${API_BASE}/`,
      {
        content,
        chatId
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
    const { message } = response.data;
    return message as Message;
  } catch (error: any) {
    console.log("Error from / messageRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error sending message.");
  }
};

export const fetchMessages = async (chatId: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.get(`${API_BASE}/${chatId}`, {
      headers: {
        Authorization: token
      }
    });
    const { messages } = response.data;
    return messages as Message[];
  } catch (error: any) {
    console.log("Error from /:chatId messageRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error fetching messages.");
  }
};