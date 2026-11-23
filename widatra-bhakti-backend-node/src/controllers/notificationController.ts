import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export function formatNotification(n: {
  id: bigint;
  user_id: bigint;
  title: string;
  body: string | null;
  tone: 'info' | 'success' | 'warning' | 'danger';
  link: string | null;
  read_at: Date | null;
  created_at: Date | null;
}) {
  return {
    id: String(n.id),
    title: n.title,
    body: n.body,
    tone: n.tone,
    link: n.link,
    read: n.read_at !== null,
    created_at: n.created_at ? n.created_at.toISOString() : null,
  };
}

export async function createNotification(params: {
  userId: bigint | number;
  title: string;
  body?: string | null;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  link?: string | null;
}) {
  return prisma.notifications.create({
    data: {
      user_id: BigInt(params.userId),
      title: params.title,
      body: params.body ?? null,
      tone: params.tone ?? 'info',
      link: params.link ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
}

export async function listNotifications(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: 'Unauthenticated.' });
    return;
  }

  const notifications = await prisma.notifications.findMany({
    where: { user_id: BigInt(user.id) },
    orderBy: { id: 'desc' },
  });

  res.json({
    data: notifications.map(formatNotification),
  });
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: 'Unauthenticated.' });
    return;
  }

  const idParam = String(req.params.id);
  let notifId: bigint;
  try {
    notifId = BigInt(idParam);
  } catch {
    res.status(404).json({ message: 'Notification not found.' });
    return;
  }

  const notif = await prisma.notifications.findUnique({
    where: { id: notifId },
  });

  if (!notif) {
    res.status(404).json({ message: 'Notification not found.' });
    return;
  }

  if (notif.user_id !== BigInt(user.id)) {
    res.status(403).json({ message: 'This action is unauthorized.' });
    return;
  }

  const updated = notif.read_at
    ? notif
    : await prisma.notifications.update({
        where: { id: notifId },
        data: {
          read_at: new Date(),
          updated_at: new Date(),
        },
      });

  res.json({
    data: formatNotification(updated),
  });
}

export async function markAllNotificationsRead(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: 'Unauthenticated.' });
    return;
  }

  await prisma.notifications.updateMany({
    where: {
      user_id: BigInt(user.id),
      read_at: null,
    },
    data: {
      read_at: new Date(),
      updated_at: new Date(),
    },
  });

  res.json({
    message: 'All notifications marked as read.',
  });
}
