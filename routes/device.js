import express from 'express'
import {
  activeDevice,
  addDevice,
  allDevices,
  deleteDevice,
  updateDevice,
  newDevices,
} from '../controllers/device.js'

const router = express.Router()

router.get('/', allDevices)
router.get('/new', newDevices)
router.get('/active', activeDevice)
router.delete('/:id', deleteDevice)
router.patch('/:id', updateDevice)
router.post('/:id', addDevice)

export default router
