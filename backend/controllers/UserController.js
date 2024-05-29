import User from "../models/UserModel.js"
import { getDataUrl } from "../utils/file.js"
import { io } from "../socket.js"
import Conversation from "../models/ConversationModel.js"

export const getUsersForSidebar = async (req, res) => {
  try {
    // await new Promise(resolve => setTimeout(resolve, 2000))
    const currentUser = req.user._id
    const users = await User.find({
      _id: { $ne: currentUser },
    }).select("-password")
    const groups = await Conversation.find({
      isGroup: true,
      $or: [{ owner: currentUser }, { members: { $all: [currentUser] } }],
    })
    const results = [...users, ...groups].sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime() > 0 ? -1 : 1,
    )
    res.status(200).json(results)
  } catch (e) {
    res.status(500).json("Internal server error")
  }
}
export const newGroupChat = async (req, res) => {
  try {
    const ownerId = req.user._id.toString()
    const { memberIds, groupName } = req.body
    const groups = await Conversation.find({ owner: ownerId }).exec()
    if (groups.length === 3) {
      return res.status(400).json("每人最多只能创建3个群聊")
    }
    const conversation = new Conversation({
      owner: ownerId,
      members: [...memberIds, ownerId],
      isGroup: true,
      groupName,
    })
    if (conversation) {
      await conversation.save()
      // socket new-conversation
      io.emit("new-conversation", conversation)
      res.status(200).json(conversation)
    } else {
      res.status(500).json("Internal server error")
    }
  } catch (e) {
    console.log(e)
    res.status(500).json("Internal server error")
  }
}

export const getUsersForUserSelector = async (req, res) => {
  try {
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
    if (!req.file) return res.status(500).json("No file uploaded")
    const base64 = await getDataUrl(Buffer.from(req.file.buffer))
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: req.user._id,
      },
      { avatar: base64 },
      { new: true },
    ).select("-password")

    if (!updatedUser) {
      return res.status(400).json("User does not exist")
    }
    // socket modify-avatar
    io.emit("modify-avatar", updatedUser)
    res.status(200).json(updatedUser)
  } catch (e) {
    console.log(e)
    res.status(500).json("Internal server error")
  }
}
