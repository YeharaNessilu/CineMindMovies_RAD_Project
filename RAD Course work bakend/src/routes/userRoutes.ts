import express from 'express';

import { 
    registerUser, 
    loginUser,
    addToWatchlist,      // ✅ 1. අලුත් function import කළා
    removeFromWatchlist, // ✅ 1. අලුත් function import කළා
    getMyWatchlist       // ✅ 1. අලුත් function import කළා
} from '../controller/userController';

import { protect } from '../middleware/authMiddleware'; // ✅ 2. Login වෙලාද බලන protect එක ගත්තා
import { getAdminStats } from '../controller/userController'; 
import {  admin } from '../middleware/authMiddleware';

const router = express.Router();

// Register & Login (කලින් තිබ්බ ඒවා)
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Watchlist Routes (අලුත් ඒවා) ---

// 3. Watchlist එකට දාන්න (Login වෙලා ඉන්න ඕනේ)
// URL: /api/users/watchlist/add
router.put('/watchlist/add', protect, addToWatchlist);

// 4. Watchlist එකෙන් අයින් කරන්න
// URL: /api/users/watchlist/remove
router.put('/watchlist/remove', protect, removeFromWatchlist);

// 5. මගේ Watchlist එක බලන්න
// URL: /api/users/watchlist
router.get('/watchlist', protect, getMyWatchlist);

router.get('/stats', protect, admin, getAdminStats);

export default router;