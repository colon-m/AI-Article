import { max } from "date-fns";

export const IronOptions = {
  cookieName: process.env.SESSION_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  },
};
