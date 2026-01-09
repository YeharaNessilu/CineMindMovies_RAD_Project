import express from 'express';
import { 
    createMovie, 
    getMovies, 
    getMovieById, 
    updateMovie, 
    deleteMovie,
    generateMovieDetails,
    getMoviesByMood  
} from '../controller/movieController';

 
import { protect, admin } from '../middleware/authMiddleware'; 

const router = express.Router();

// Specific Routes  

//  AI Generate Route එක 
router.post('/ai-generate', protect, admin, generateMovieDetails);

// Mood Search Route එක 
router.post('/mood-search', getMoviesByMood);

//  General Public Routes 
router.get('/', getMovies);       

//  Protected Routes (Admin Operations) 
// අලුත් ෆිල්ම් එකක් දාන්න
router.post('/', protect, admin, createMovie);

//  Dynamic ID Routes 

 router.get('/:id', getMovieById); 
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;