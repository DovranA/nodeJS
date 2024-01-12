import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
const { Schema } = mongoose

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  devices: {
    type: [String],
  },
})

export default mongoose.model('Room', RoomSchema)
