import { Request, Response } from 'express';
import User from '../models/userModel';
import Movie from '../models/movie.model';  
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Token එක හදන Function එක
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

//   User Register කරන function එක
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await User.create({
            firstName, lastName, email, password, 
            role: role || 'user', watchlist: []
        });
        if (user) {
            res.status(201).json({
                _id: user._id, firstName: user.firstName, lastName: user.lastName,
                email: user.email, role: user.role, token: generateToken(user._id.toString())
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

//   User Login කරන function එක
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                _id: user._id, firstName: user.firstName, lastName: user.lastName,
                email: user.email, role: user.role, watchlist: user.watchlist,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//   Watchlist Add
export const addToWatchlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id; 
        const { movieId } = req.body;
        const user = await User.findByIdAndUpdate(
            userId, { $addToSet: { watchlist: movieId } }, { new: true }
        ).populate('watchlist');
        res.status(200).json(user?.watchlist);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Watchlist Remove
export const removeFromWatchlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const { movieId } = req.body;
        const user = await User.findByIdAndUpdate(
            userId, { $pull: { watchlist: movieId } }, { new: true }
        ).populate('watchlist');
        res.status(200).json(user?.watchlist);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//   Get Watchlist
export const getMyWatchlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId).populate('watchlist');
        if (user) {
            res.status(200).json(user.watchlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//   Admin Stats ගන්න Function එක  
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Users සහ Movies ගණන් කරනවා
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();

        res.status(200).json({
            totalUsers,
            totalMovies
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};