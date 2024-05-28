import express from "express"
import {
  getUsersForSidebar,
  getUsersForUserSelector,
  newGroupChat,
  updateUserAvatar,
} from "../controllers/UserController.js"
import { isLoggedIn } from "../middlewares/index.js"
import multer from "multer"

const upload = multer()
const router = express.Router()
router.get("/", isLoggedIn, getUsersForSidebar)
router.post("/newGroupChat", isLoggedIn, newGroupChat)
router.get("/forSelector", isLoggedIn, getUsersForUserSelector)
router.post("/avatar", isLoggedIn, upload.single("file"), updateUserAvatar)
export default router
