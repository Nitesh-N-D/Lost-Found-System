import api, { unwrap } from "./api";

export const adminService = {
  getDashboard: () => unwrap(api.get("/admin/dashboard")),
  banUser: (id) => unwrap(api.put(`/admin/users/${id}/ban`)),
  unbanUser: (id) => unwrap(api.put(`/admin/users/${id}/unban`)),
  deleteItem: (id) => unwrap(api.delete(`/admin/items/${id}`)),
};
