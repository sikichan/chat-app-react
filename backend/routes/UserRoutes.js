import express from "express"
import {
  getUsersForSidebar,
  updateUserAvatar,
} from "../controllers/UserController.js"
import { isLoggedIn } from "../middlewares/index.js"
import multer from "multer"

const upload = multer()
const router = express.Router()
router.get("/", isLoggedIn, getUsersForSidebar)
router.post("/avatar", isLoggedIn, upload.single("file"), updateUserAvatar)
export default router
