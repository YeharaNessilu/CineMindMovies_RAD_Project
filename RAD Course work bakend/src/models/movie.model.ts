import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
    title: string;
    description: string;
    genre: string;
    releaseDate: string; // දිනයක් විදියට
    rating: number; // 1-10 අතර අගයක්
    image: string; // Movie poster එකේ link එක
    telegramLink?: string; // ✅ අලුතෙන් එකතු කළ Telegram Link එක
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
        required: false // පින්තූරයක් නැති වුනත් කමක් නෑ
    },
    telegramLink: { 
        type: String, 
        required: false // ✅ ලින්ක් එකක් නැති වුනත් අවුලක් නෑ
    },

    // ✅ 2. අන්න මේ පේළිය Schema එක ඇතුලේ තියෙන්නම ඕනේ! නැත්නම් Save වෙන්නේ නෑ.
    trailerLink: { type: String, required: false }
}, {
    timestamps: true
});

export default mongoose.model<IMovie>('Movie', MovieSchema);