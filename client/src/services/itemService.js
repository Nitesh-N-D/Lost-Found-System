import api, { unwrap } from "./api";

export const itemService = {
  list: (params) => unwrap(api.get("/items", { params })),
  listMine: async () => {
    const endpoints = ["/dashboard/items", "/items/me", "/items/mine"];

    for (const endpoint of endpoints) {
      try {
        return await unwrap(api.get(endpoint));
      } catch (error) {
        if (!error.message.includes("404")) {
          throw error;
        }
      }
    }

    throw new Error("Unable to load your items right now.");
  },
  getById: (id) => unwrap(api.get(`/items/${id}`)),
  create: (payload) => unwrap(api.post("/items", payload)),
  remove: (id) => unwrap(api.delete(`/items/${id}`)),
};
