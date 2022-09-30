import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const { JWT_SECRET, JWT_RESET } = process.env;

export const generateToken = (
  token: {
    [key: string]: any;
  },
  options?: {
    expiresIn: string | number;
  }
) => {
  const { expiresIn } = options || {
    expiresIn: "1d",
  };
  return jwt.sign(token, JWT_SECRET, {
    expiresIn,
  });
};

export const generateResetToken = (
  token: {
    [key: string]: any;
  },
  options?: {
    expiresIn: string | number;
  }
) => {
  const { expiresIn } = options || {
    expiresIn: "30d",
  };
  return jwt.sign(token, JWT_RESET, {
    expiresIn,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyResetToken = (token: string) => {
  return jwt.verify(token, JWT_RESET);
};
