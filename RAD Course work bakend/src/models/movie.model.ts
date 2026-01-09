import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
    title: string;
    description: string;
    genre: string;
    releaseDate: string;  
    rating: number;  
    image: string;  
    telegramLink?: string;  
}

const MovieSchema: Schema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    genre: { 
        type: String, 
        required: true 
    },
    releaseDate: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true 
    },
    image: { 
        type: String, 
        required: false  
    },
    telegramLink: { 
        type: String, 
        required: false  
    },

     
    trailerLink: { 
        type: String, 
        required: false 
    }
}, {
    timestamps: true
});

export default mongoose.model<IMovie>('Movie', MovieSchema);