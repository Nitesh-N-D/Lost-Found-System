const ADMIN_EMAILS = ["niteshndmaster@gmail.com"];

export const isAdminUser = (user) =>
  Boolean(user?.role === "admin" || ADMIN_EMAILS.includes(user?.email?.toLowerCase?.()));
