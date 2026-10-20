import api, { unwrap } from "./api";

export const itemReportService = {
  create: (itemId, payload) => unwrap(api.post(`/reports/items/${itemId}`, payload)),
};
