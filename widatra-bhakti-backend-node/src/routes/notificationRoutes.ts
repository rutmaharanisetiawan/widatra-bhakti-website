import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', listNotifications);
router.post('/read-all', markAllNotificationsRead);
router.post('/mark-all-read', markAllNotificationsRead);
router.post('/:id/read', markNotificationRead);
router.patch('/:id/read', markNotificationRead);

export default router;
