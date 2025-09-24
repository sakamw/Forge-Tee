import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/userMiddleware";
import { sendEmail } from "../services/mailer";
import { freelancerApplicationReceivedEmailHtml } from "../emails/templates";

const prisma = new PrismaClient();

export async function applyForFreelancer(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const notes = (req.body?.notes as string | undefined) || undefined;

    // Create or update application to PENDING
    const existing = await prisma.freelancerApplication.findUnique({ where: { userId } });
    if (existing) {
      const updated = await prisma.freelancerApplication.update({
        where: { userId },
        data: { status: "PENDING" as any, notes },
      });
      // Send email: application received (pending)
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: "We received your freelancer application",
            html: freelancerApplicationReceivedEmailHtml({ firstName: user.firstName ?? undefined }),
          });
        } catch (_) {
          // ignore email errors
        }
      }
      return res.json({ message: "Application updated to pending.", application: updated });
    }
    const app = await prisma.freelancerApplication.create({
      data: { userId, status: "PENDING" as any, notes },
    });
    // Send email: application received (pending)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "We received your freelancer application",
          html: freelancerApplicationReceivedEmailHtml({ firstName: user.firstName ?? undefined }),
        });
      } catch (_) {
        // ignore email errors
      }
    }
    return res.status(201).json({ message: "Application submitted.", application: app });
  } catch (e) {
    return res.status(500).json({ message: "Failed to submit application." });
  }
}

export async function getMyFreelancerApplication(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const app = await prisma.freelancerApplication.findUnique({ where: { userId } });
    if (!app) {
      return res.status(200).json({ status: "NONE" });
    }
    return res.json({ status: app.status, application: app });
  } catch (e) {
    return res.status(500).json({ message: "Failed to fetch application." });
  }
}
