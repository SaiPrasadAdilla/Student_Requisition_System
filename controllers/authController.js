import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from '../models/userModel.js'
import JWT from 'jsonwebtoken'

export const registerController = async (req, res) => {
  try {
    const { name, email, department, roll_no,password } = req.body;

    //Validations
    if (!name) {
      return res.send({ message: 'Name is Required' })
    }
    if (!email) {
      return res.send({ message: 'Email is Required' })
    }
    if (!department) {
      return res.send({ message: 'Password is Required' })
    }
    if (!roll_no) {
      return res.send({ message: 'Roll No is Required' })
    }
    if (!password) {
      return res.send({ message: 'Password is Required' })
    }
    //Check user
    const existingUser = await userModel.findOne({ email })
    //Existing User 
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already Registered, Please Login...'
      })
    }
    //Register User
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({ name, email, department, roll_no, password: hashedPassword }).save();

    res.status(201).send({
      success: true,
      message: 'User Registered Successfully',
      user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Registration',
      error
    })
  }
}

//Poost Login
export const loginController = async(req,res) => {
  try{
    const {email, password} = req.body
    if(!email || !password){
      return res.status(404).send({
        success: false,
        message:"Invalid Email or Password"
      })
    }
    //check user
    const user = await userModel.findOne({email})
    if(!user){
      return res.status(404).send({
        success: false,
        message: 'Email is not registered'
      })
    }

    const match = await comparePassword(password, user.password);
    if(!match){
      return res.status(200).send({
        success: false,
        message: 'Invalid Password'
      })
    }
    //Token
    const token = await JWT.sign({
      _id: user._id
    }, process.env.JWT_SECRET,{expiresIn: '7d',}) ;
    res.status(200).send({
      success: true,
      message: 'Login Successfully',
      user:{
        name: user.name,
        email: user.email,
        department: user.department,
        roll_no: user.roll_no,
        role: user.role,
      },
      token,
    });
  } catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error
    })
  }
}


//forgot password controller
export const forgotPasswordController = async (req, res) => {
  try {
    const {email, roll_no, newPassword} = req.body
    if(!email){
      res.status(400).send({message: 'Email is Required'})
    }
    
    if(!roll_no){
      res.status(400).send({message: 'Roll No is Required'})
    }
    if(!newPassword){
      res.status(400).send({message: 'New Password is Required'})
    }
    //Check
    const user = await userModel.findOne({email, roll_no});
    //Validation
    if(!user){
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      })
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {password: hashed})
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Something went Wrong',
      error
    })   
  }
}

export const getRequestsController = async (req, res) => {
  try {
    const requests = await RequestModel.find({ user: req.user._id });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const approveRequisition = async (req, res) => {
  const { id } = req.params;
  try {
    // TODO: replace with real DB logic
    // e.g., await Requisition.findByIdAndUpdate(id, { status: 'Approved' });
    res.status(200).json({ message: 'Approved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const testController = async (req,res) =>{
  try{
    res.send("Protected Route");
  } catch(error){
    console.log(error);
    res.send({error});
  }
}
