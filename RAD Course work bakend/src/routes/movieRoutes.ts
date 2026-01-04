import express from 'express';
import { 
    createMovie, 
    getMovies, 
    getMovieById, 
    updateMovie, 
    deleteMovie,
    generateMovieDetails,
    getMoviesByMood // ✅ 1. මේක අලුතෙන් Import කළා
} from '../controller/movieController';

// ✅ නිවැරදි කිරීම: අපි admin හැදුවේ authMiddleware එකේ. ඒක නිසා එතනින්ම ගමු.
import { protect, admin } from '../middleware/authMiddleware'; 

const router = express.Router();

// --- 1. Specific Routes (මුලින්ම විශේෂ ඒවා දාන්න ඕනේ) ---

// ✅ AI Generate Route එක (මේක අනිවාර්යයෙන්ම මුලටම ගන්න)
router.post('/ai-generate', protect, admin, generateMovieDetails);

// ✅ Mood Search Route එක (මේකත් විශේෂ එකක් නිසා මුලටම ගත්තා)
router.post('/mood-search', getMoviesByMood);


// --- 2. General Public Routes ---

router.get('/', getMovies);       


// --- 3. Protected Routes (Admin Operations) ---

// අලුත් ෆිල්ම් එකක් දාන්න
router.post('/', protect, admin, createMovie);


// --- 4. Dynamic ID Routes (මේවා අනිවාර්යයෙන්ම යටින්ම තියන්න) ---
// හේතුව: /:id එක උඩින් තිබ්බොත්, 'ai-generate' වගේ වචනත් ID එකක් කියලා හිතන්න පුළුවන්.

router.get('/:id', getMovieById); 
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;