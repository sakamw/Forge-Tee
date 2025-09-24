import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";

const prisma = new PrismaClient();

export async function getBuyerOrders(_req: AuthRequest, res: Response) {
  try {
    return res.json({ orders: [] });
  } catch (e) {
    return res.status(500).json({ orders: [] });
  }
}

export async function getFreelancerPortfolio(req: AuthRequest, res: Response) {
  try {
    return res.json({ designs: [] });
  } catch (e) {
    return res.status(500).json({ designs: [] });
  }
}

export async function getAdminOverview(_req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.count();
    const freelancers = await prisma.freelancerApplication.count({
      where: { status: "APPROVED" as any },
    });
    const pendingApprovals = await prisma.freelancerApplication.count({
      where: { status: "PENDING" as any },
    });
    return res.json({
      users,
      freelancers,
      designs: 0,
      orders: 0,
      pendingApprovals,
    });
  } catch (e) {
    return res
      .status(500)
      .json({
        users: 0,
        freelancers: 0,
        designs: 0,
        orders: 0,
        pendingApprovals: 0,
      });
  }
}
