import mongoose, { Document, Schema } from 'mongoose'

export interface IElection extends Document {
  _id: string
  title: string
  description?: string
  start_time: Date
  end_time: Date
  is_active: boolean
  createdAt: Date
  updatedAt: Date
}

const ElectionSchema = new Schema<IElection>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.models.Election || mongoose.model<IElection>('Election', ElectionSchema)