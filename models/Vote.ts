import mongoose, { Document, Schema } from 'mongoose'

export interface IVote extends Document {
  _id: string
  post_id: mongoose.Types.ObjectId
  candidate_id: mongoose.Types.ObjectId
  user_id: mongoose.Types.ObjectId
  createdAt: Date
}

const VoteSchema = new Schema<IVote>({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  candidate_id: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Ensure one vote per user per post
VoteSchema.index({ post_id: 1, user_id: 1 }, { unique: true })

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema)