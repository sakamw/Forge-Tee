import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import zxcvbn from "zxcvbn";

const client = new PrismaClient();

export async function verifyUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }
  next();
}

export async function checkEmailAndUsernameReuse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, email } = req.body;
  const existingUser = await client.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    res.status(400).json({ message: "Email or username already in use." });
    return;
  }
  next();
}

export async function verifyPassStrength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;
  const result = zxcvbn(password);

  if (result.score < 3) {
    res.status(400).json({ message: "Please select a stronger password" });
    return;
  }
  next();
}
