const sanitizeValue = (value, key = "") => {
  if (typeof value === "string") {
    // Passwords are opaque credentials: whitespace can be intentional.
    return key === "password" ? value : value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        sanitizeValue(nestedValue, key),
      ])
    );
  }

  return value;
};

const sanitizeBody = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  next();
};

module.exports = sanitizeBody;
