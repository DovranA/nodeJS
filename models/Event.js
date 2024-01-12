import mongoose from 'mongoose'
const { Schema } = mongoose

const EventSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  eventType: { type: String, required: true },
  deviceId: { type: String, ref: 'Device' },
})
export default mongoose.model('Event', EventSchema)
