import axios from "axios";
import type { User } from "../types/User";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE = `${BASE_URL}/api/users`;

export const searchUsers = async (query: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.get(`${API_BASE}?query=${query}`, {
      headers: {
        Authorization: token
      }
    });
    const { users } = response.data;
    return users as User[];
  } catch (error: any) {
    console.log("Error from / usersRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error searching for users.");
  }
};

export const getUserById = async (id: string) => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.get(`${API_BASE}/${id}`, {
      headers: {
        Authorization: token
      }
    });
    const { user } = response.data;
    return user as User;
  } catch (error: any) {
    console.log("Error from / usersRoute:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || error.message || "Error fetching user.");
  }
};