import mongoose from 'mongoose'
const { Schema } = mongoose

const DeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  serial: {
    type: Number,
    required: true,
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

export default mongoose.model('Device', DeviceSchema)
