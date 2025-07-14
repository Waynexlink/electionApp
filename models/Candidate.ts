import mongoose, { Document, Schema } from 'mongoose'

export interface ICandidate extends Document {
  _id: string
  post_id: mongoose.Types.ObjectId
  name: string
  bio?: string
  department?: string
  image_url?: string
  image_public_id?: string
  createdAt: Date
  updatedAt: Date
}

const CandidateSchema = new Schema<ICandidate>({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  image_public_id: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Ensure unique candidate name per post
CandidateSchema.index({ post_id: 1, name: 1 }, { unique: true })

export default mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema)