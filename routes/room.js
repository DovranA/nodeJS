import { Router } from 'express'
import {
  addRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from '../controllers/room.js'
const router = Router()

router.post('/', addRoom)
router.get('/', getAllRooms)
router.get('/:id', getRoomById)
router.patch('/:id', updateRoom)
router.delete('/:id', deleteRoom)

export default router
