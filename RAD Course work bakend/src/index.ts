import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config';
import userRoutes from './routes/userRoutes';
import movieRoutes from './routes/movieRoutes';

//   අලුතෙන් හදපු Error Middleware දෙක import කරගන්නවා
import { notFound, errorHandler } from './middleware/errorMiddleware';

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Frontend එකට අවසර දෙන්න
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('CineMind API is Running...');
});

//   Routes වලට පස්සේ Error Handling Middleware දාන්න ඕනේ

app.use(notFound);
app.use(errorHandler);

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});