import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs'; 

// 1. User කෙනෙක්ට තියෙන්න ඕන දේවල් (Interface)
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    watchlist: mongoose.Types.ObjectId[];
}

// 2. Database එකට දාන හැඩය (Schema)
const UserSchema: Schema = new Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,      
        lowercase: true  
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6     
    },
    role: { 
        type: String, 
        default: 'user' 
    },
    watchlist: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie' 
    }]
}, {
    timestamps: true 
});

// ✅ නිවැරදි කිරීම: 'next' සම්පූර්ණයෙන්ම අයින් කළා.
// async function එකක් නිසා දැන් Mongoose ඉබේම දන්නවා වැඩේ ඉවරයි කියලා.
UserSchema.pre('save', async function (this: IUser) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 3. Model එක export කිරීම
export default mongoose.model<IUser>('User', UserSchema);