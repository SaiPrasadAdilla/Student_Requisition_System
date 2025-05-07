import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import requestModel from '../models/requestModel.js';
import notificationModel from '../models/notificationModel.js';


const router = express.Router();

// POST request to create a new requisition
router.post('/create', requireSignIn, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and Category are required',
      });
    }

    const newRequest = new requestModel({
      user: req.user._id,
      title,
      description,
      category,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Request Created Successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Error Creating Request:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
});

// GET all requests of the logged-in user (student)
router.get('/my-requests', requireSignIn, async (req, res) => {
  try {
    const requests = await requestModel
      .find({ user: req.user._id }) // find requests for the logged-in user
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      error,
    });
  }
});

router.get('/all', requireSignIn, isAdmin, async (req, res) => {
  try {
    const requests = await requestModel.find().populate('user', 'name email');
    res.json({ success: true, requests });
  } catch (err) {
    console.error('Error fetching all requests:', err);
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});

// UPDATE request status (Approve/Reject)
router.put('/update-status/:id', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = await requestModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, message: 'Status updated', request: updatedRequest });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

// GET approved requests
router.get('/approved', requireSignIn, isAdmin, async (req, res) => {
  try {
    const approvedRequests = await requestModel
      .find({ status: 'Approved' })
      .populate('user', 'name email');
    res.json({ success: true, requests: approvedRequests });
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({ success: false, message: 'Error fetching approved requests' });
  }
});

// GET rejected requests
router.get('/rejected', requireSignIn, isAdmin, async (req, res) => {
  try {
    const rejectedRequests = await requestModel
      .find({ status: 'Rejected' })
      .populate('user', 'name email');
    res.json({ success: true, requests: rejectedRequests });
  } catch (error) {
    console.error('Error fetching rejected requests:', error);
    res.status(500).json({ success: false, message: 'Error fetching rejected requests' });
  }
});

router.put('/update-status/:id', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await requestModel.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    // Create notification for the user
    const notificationMessage = `Your request "${request.title}" has been ${status}.`;
    const notification = new notificationModel({
      user: request.user,
      message: notificationMessage,
    });
    await notification.save();

    res.json({ success: true, message: 'Request status updated', request });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


export default router;
