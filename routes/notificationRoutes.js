import express from 'express';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import notificationModel from '../models/notificationModel.js';

const router = express.Router();

router.get('/my-notifications', requireSignIn, async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});

export default router;
