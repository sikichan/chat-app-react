import express from "express"
import { isLoggedIn } from "../middlewares/index.js"
import {
  getMessages,
  sendMessage,
  sendMessageInGroup,
  withdrawMessage,
} from "../controllers/MessageController.js"

const router = express.Router()
router.post("/send/:id", isLoggedIn, sendMessage)
router.post("/sendInGroup", isLoggedIn, sendMessageInGroup)
router.get("/:id", isLoggedIn, getMessages)
router.delete("/withdraw/:id", isLoggedIn, withdrawMessage)
export default router
