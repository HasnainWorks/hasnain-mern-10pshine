import api from "./api";

export const authService = {
  signup: async (name, email, password) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    return data; // { message, user } — no token
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) localStorage.setItem("token", data.token);
    return data; // { message, token, user }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getMe: () => {
    // Backend has no /auth/me route — read from localStorage instead
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  },
};