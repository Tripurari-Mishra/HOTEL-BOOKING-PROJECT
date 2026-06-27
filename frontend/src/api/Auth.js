import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}auth/`,
  withCredentials: true,
});

export const login = async (username, password) => {
  try {
    const res = await apiClient.post("login", { username, password });
    console.log("Login Api Call", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (formData) => {
  try {
    const res = await apiClient.post("register", formData);
    console.log("signup api call", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const isLogout = async () => {
  try {
    const res = await apiClient.get("logout");
    console.log("user logout", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getLoggedInUser = async () => {
  try {
    const res = await apiClient.get("me");
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};