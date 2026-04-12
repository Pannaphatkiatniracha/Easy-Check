import express from 'express'
import {
  getAllLocations,
  getActiveLocationsByBranch,
  createLocation,
  updateLocation,
  deleteLocation,
  toggleLocation,
  getAllBranches
} from '../controllers/gpsLocationController.js'

const router = express.Router()

// ---------- Branches ----------
router.get('/branches', getAllBranches)

// ---------- GPS Locations ----------
router.get('/', getAllLocations)
router.get('/active', getActiveLocationsByBranch)
router.post('/', createLocation)
router.put('/:id', updateLocation)
router.delete('/:id', deleteLocation)
router.patch('/:id/toggle', toggleLocation)

export default router
