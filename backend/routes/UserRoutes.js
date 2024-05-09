import express from 'express'
import { getUsersForSidebar } from '../controllers/UserController.js'
import { isLoggedIn } from '../middlewares/index.js'

const router = express.Router()
router.get('/', isLoggedIn, getUsersForSidebar)
export default router