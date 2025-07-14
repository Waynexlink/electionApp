import mongoose, { Document, Schema } from 'mongoose'

export interface IEligibleVoter extends Document {
  _id: string
  matric_no: string
  name: string
  department: string
  createdAt: Date
}

const EligibleVoterSchema = new Schema<IEligibleVoter>({
  matric_no: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

export default mongoose.models.EligibleVoter || mongoose.model<IEligibleVoter>('EligibleVoter', EligibleVoterSchema)