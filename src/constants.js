export const DB_NAME = "IMS-DB"

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true, // Ensure HTTPS is used
    sameSite: "none", // Required for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};