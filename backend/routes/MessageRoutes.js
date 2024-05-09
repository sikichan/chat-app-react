import express from 'express'
import { isLoggedIn } from '../middlewares/index.js'
import { getMessages, sendMessage } from '../controllers/MessageController.js'

const router = express.Router()
router.post('/send/:id', isLoggedIn, sendMessage)
router.get('/:id', isLoggedIn, getMessages)
export default router