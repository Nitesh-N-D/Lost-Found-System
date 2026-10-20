import api, { unwrap } from "./api";

export const savedItemService = {
  list: () => unwrap(api.get("/items/saved")),
  toggle: (itemId) => unwrap(api.put(`/items/${itemId}/save`)),
};
