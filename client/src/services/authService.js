import api, { unwrap } from "./api";

export const authService = {
  login: (payload) => unwrap(api.post("/auth/login", payload)),
  register: (payload) => unwrap(api.post("/auth/register", payload)),
  getProfile: () => unwrap(api.get("/auth/profile")),
  updateProfile: (payload) => unwrap(api.put("/auth/profile", payload)),
};
