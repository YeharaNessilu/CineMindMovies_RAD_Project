import express from 'express';

import { 
    registerUser, 
    loginUser,
    addToWatchlist,      
    removeFromWatchlist, 
    getMyWatchlist       
} from '../controller/userController';

import { protect } from '../middleware/authMiddleware'; //  Login වෙලාද බලන protect එක ගත්තා
import { getAdminStats } from '../controller/userController'; 
import {  admin } from '../middleware/authMiddleware';

const router = express.Router();

// Register & Login  
router.post('/register', registerUser);
router.post('/login', loginUser);

 

//  Watchlist එකට දාන්න (Login වෙලා ඉන්න ඕනේ)
 router.put('/watchlist/add', protect, addToWatchlist);

//  Watchlist එකෙන් අයින් කරන්න
 router.put('/watchlist/remove', protect, removeFromWatchlist);

//  මගේ Watchlist එක බලන්න
router.get('/watchlist', protect, getMyWatchlist);

//  Admin Stats එක ගන්න
router.get('/stats', protect, admin, getAdminStats);

export default router;