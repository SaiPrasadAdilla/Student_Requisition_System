import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import requestRoutes from './routes/requestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';



//rest object
const app = express();

//env config
dotenv.config();

//Database Connection
connectDb();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth", authRoutes);

app.use('/api/v1/requests', requestRoutes);

app.use('/api/v1/notifications', notificationRoutes);

//rest Api
app.get('/', (req, res) => {
  res.send('<h1>Welocme to the E-commerce site</h1>')
})
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is Running on mode ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white);
})

