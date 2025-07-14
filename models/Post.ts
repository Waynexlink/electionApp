import mongoose, { Document, Schema } from 'mongoose'

export interface IPost extends Document {
  _id: string
  election_id: mongoose.Types.ObjectId
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>({
  election_id: {
    type: Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)