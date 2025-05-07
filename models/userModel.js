import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  roll_no: {
    type: Number,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  }, 
},
{timestamps: true});

export default mongoose.model('User', userSchema);