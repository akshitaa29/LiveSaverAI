import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("✅ Protect middleware called");
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Authorization Header:", authHeader);
console.log("Extracted Token:", token);


  const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET as string
);

req.user = decoded as {
  userId: string;
  iat: number;
  exp: number;
};

next();
  } catch (error) {
  console.error(error);

  return res.status(401).json({
    success: false,
    message: "Invalid Token",
  });
}
};