import User from "../models/UserModel.js"
import { getDataUrl } from "../utils/file.js"
import { io } from "../socket.js"

export const getUsersForSidebar = async (req, res) => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 2000))
    const currentUser = req.user._id
    const users = await User.find({
      _id: { $ne: currentUser },
    }).select("-password")
    res.status(200).json(users)
  } catch (e) {
    res.status(500).json("Internal server error")
  }
}

export const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const base64 = await getDataUrl(Buffer.from(req.file.buffer))
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: req.user._id,
      },
      { avatar: base64 },
      { new: true },
    ).select("-password")

    if (!updatedUser) {
      return res.status(400).json({ error: "User does not exist" })
    }
    // socket modify-avatar
    io.emit("modify-avatar", updatedUser)
    res.status(200).json(updatedUser)
  } catch (e) {
    console.log(e)
    res.status(500).json("Internal server error")
  }
}
