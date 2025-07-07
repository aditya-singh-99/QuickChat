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
    console.log("Error from / chatRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error fetching chats.");
  }
};

export const createChat = async (participant: string | string[], name?: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.post(`${API_BASE}/`,
      {
        participant,
        name
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
    const { chat } = response.data;
    return chat as Chat;
  } catch (error: any) {
    console.log("Error from / chatRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error creating chat.");
  }
};

export const addUserToGroup = async (id: string, participant: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.put(`${API_BASE}/group/add`,
      {
        id,
        participant
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
    const { chat } = response.data;
    return chat as Chat;
  } catch (error: any) {
    console.log("Error from /group/add chatRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error adding user.");
  }
};

export const removeUserFromGroup = async (id: string, participant: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.put(`${API_BASE}/group/remove`,
      {
        id,
        participant
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
    const { chat } = response.data;
    return chat as Chat;
  } catch (error: any) {
    console.log("Error from /group/remove chatRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error removing user.");
  }
};