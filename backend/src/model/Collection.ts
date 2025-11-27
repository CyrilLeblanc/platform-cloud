import mongoose, { Schema, Document, Model } from 'mongoose';

export interface CollectionDocument extends Document {
    id: number
    name: string
    description?: string
    created_at: Date
    updated_at: Date
}
