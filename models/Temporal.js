import mongoose from 'mongoose'
const { Schema } = mongoose

const Temporal = new Schema({
  type: {
    type: String,
  },
  serial: {
    type: Number,
    required: true,
    unique: true,
  },
  ip: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
})

export default mongoose.model('Temporal', Temporal)
