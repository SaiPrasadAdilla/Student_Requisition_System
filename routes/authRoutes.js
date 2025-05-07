import express from 'express'
import {forgotPasswordController, loginController, registerController, testController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Routing

//Register || Method Post
router.post('/register', registerController);


//lOGIN || pOST
router.post('/login', loginController);

//Test Routes
router.get('/test', requireSignIn, isAdmin, testController);


//forgot password
router.post('/forgot-password', forgotPasswordController)

//protected Route
router.get('/user-auth', requireSignIn, (req, res) =>{
  res.status(200).send({ok: true});
});

//Protected Rote auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) =>{
  res.status(200).send({ok: true});
});


//Post creted new Requests
router.post('/create', requireSignIn, async (req, res) => {
  try {
    // Destructure the necessary fields from the request body
    const { title, description, category } = req.body;

    // Validation: Check if title and category are provided
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and Category are required',
      });
    }

    // Create a new request instance using the requestModel
    const newRequest = new requestModel({
      user: req.user._id, // Assuming the user is logged in and `req.user` contains the user info
      title,
      description,
      category,
    });

    // Save the new request to the database
    await newRequest.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Request Created Successfully',
      request: newRequest, // Optionally send back the created request
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
//Requests




export default router;