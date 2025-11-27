import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserDocument extends Document {
    id: number;
    username: string;
    email: string;
    hashed_password: string;
    createdAt: Date;
    isActive: boolean;
}

const UserSchema: Schema<UserDocument> = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        hashed_password: { type: String, required: true },
        isActive: { type: Boolean, required: true, default: true }
    },
    {
        timestamps: true
    }
);

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
