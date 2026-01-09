import { Request, Response } from 'express';
import Movie from '../models/movie.model';
import { GoogleGenerativeAI } from '@google/generative-ai';

//   ඔක්කොම Movies ටික ගන්න  
export const getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//   තනි Movie එකක් ID එකෙන් ගන්න  
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);

        if (!movie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }

        res.status(200).json(movie);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

//   අලුත් Movie එකක් දාන්න (POST) - Links Explicitly Add කළා
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        // Body එකෙන් අපිට ඕන ටික විතරක් තෝරලා ගන්නවා
        const { title, description, genre, releaseDate, rating, image, telegramLink, trailerLink } = req.body;

        const newMovie = new Movie({
            title,
            description,
            genre,
            releaseDate,
            rating,
            image,
            telegramLink,  
            trailerLink    
        });

        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
};

//   තියෙන Movie එකක් වෙනස් කරන්න (PUT)  
export const updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, genre, releaseDate, rating, image, telegramLink, trailerLink } = req.body;

        // අලුත් විස්තර වලින් update කරනවා
        const updatedMovie = await Movie.findByIdAndUpdate(
            id, 
            { 
                title, 
                description, 
                genre, 
                releaseDate, 
                rating, 
                image, 
                telegramLink,  
                trailerLink    
            }, 
            { new: true }
        );

        res.status(200).json(updatedMovie);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Movie එකක් මකන්න (DELETE)
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await Movie.findByIdAndDelete(id);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// 6. AI මගින් විස්තර ලබා ගැනීම (Generate Details)
export const generateMovieDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Checking API Key:", process.env.GEMINI_API_KEY);
        const { title } = req.body;

        if (!title) {
            res.status(400).json({ message: 'Movie title is required' });
            return;
        }

        // Gemini එකට කතා කරනවා
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Provide the following details for the movie "${title}" in strict JSON format:
        {
            "description": "A short summary of the movie (max 2 sentences)",
            "genre": "The main genre (e.g. Action, Comedy, Horror)",
            "releaseDate": "The release date in YYYY-MM-DD format",
            "rating": "A number between 1-10 (e.g. 8.5)"
        }
        Do not allow any extra text, just the JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const movieData = JSON.parse(cleanedText);

        res.status(200).json(movieData);

    } catch (error: any) {
        console.error("AI Error:", error);
        res.status(500).json({ message: 'Failed to generate details', error: error.message });
    }
};

//   MOOD BASED SEARCH (මේක තමයි අලුතෙන් දැම්මේ)
export const getMoviesByMood = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mood } = req.body; // Frontend එකෙන් එන Mood එක  

        if (!mood) {
            res.status(400).json({ message: 'Mood is required' });
            return;
        }

        //   Database එකේ තියෙන ෆිල්ම් ටික ගන්නවා (ID, Title, Genre, Description විතරයි)
        const allMovies = await Movie.find({}, 'title genre description _id');

        //   AI එකට යවන්න සූදානම් කරනවා
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        
         
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        //   AI Prompt එක (Mood එකට ගැලපෙන ෆිල්ම්ස් තෝරන්න කියනවා)
        const prompt = `
        I have a user who is in a "${mood}" mood.
        Here is a list of movies available in my database: 
        ${JSON.stringify(allMovies)}

        Based on the user's mood, select the top 5 movies that match best.
        Strictly return ONLY a valid JSON array of the matching movie "_id"s.
        Example format: ["65a123...", "65b456..."]
        Do not add any extra text, just the JSON array.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        //   AI දුන්න උත්තරේ (IDs List එක) සුද්ද කරලා ගන්නවා
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const recommendedIds = JSON.parse(cleanedText);

        //   ඒ IDs වලට අදාළ ෆිල්ම්ස් Database එකෙන් අරන් යවනවා
        const recommendedMovies = await Movie.find({ _id: { $in: recommendedIds } });

        res.status(200).json(recommendedMovies);

    } catch (error: any) {
        console.error("Mood Search Error:", error);
        res.status(500).json({ message: 'Failed to recommend movies', error: error.message });
    }
};