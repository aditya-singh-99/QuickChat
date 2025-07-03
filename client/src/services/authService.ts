import axios from "axios";
import type { User } from "../types/User";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE = `${BASE_URL}/api/auth`;

export const fetchMe = async () => {
  try {
    const token = localStorage.getItem("JWTtoken");
    const response = await axios.get(`${API_BASE}/me`, {
      headers: {
        Authorization: token
      }
    });
    const { user } = response.data;
    return user as User;
  } catch (error: any) {
    console.log("Error from /me authRoute:", error.response?.data?.error|| error.message);
    throw new Error(error.response?.data?.error|| error.message || "Error fetching user.");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE}/login`,
      {
        email,
        password
      }
    );
    const { user, token } = response.data;
    return {
      user: user as User,
      token: token as string
    };
  } catch (error: any) {
    console.log("Error from /login authRoute:", error.response?.data?.error|| error.message);
    throw new Error(error.response?.data?.error|| error.message || "Error logging user.");
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    await axios.post(`${API_BASE}/register`,
      {
        name,
        email,
        password
      }
    );
  } catch (error: any) {
    console.log("Error from /register authRoute:", error.response?.data?.error|| error.message);
    throw new Error(error.response?.data?.error || error.message || "Error registering user.");
  }
};