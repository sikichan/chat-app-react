import Message from "../models/MessageModel.js"
import Conversation from "../models/ConversationModel.js"
import { getSocketIdByUserId, io } from "../socket.js"

export const sendMessage = async (req, res) => {
  try {
    const { message, messageType = "text" } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    })

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      })
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      messageType,
    })

    if (newMessage) {
      conversation.messages.push(newMessage._id)
    }

    await Promise.all([conversation.save(), newMessage.save()])
    // socket new-message
    const receiverSocketId = getSocketIdByUserId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage)
    }
    const senderSocketId = getSocketIdByUserId(senderId)
    if (senderSocketId) {
      io.to(senderSocketId).emit("new-message", newMessage)
    }

    res.status(201).json(newMessage)
  } catch (e) {
    console.log("Error in MessageController.sendMessage: ", e)
    res.status(500).json("Internal server error")
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params
    let createdAt = parseInt(req.query.createdAt)
    const limit = 10
    const senderId = req.user._id.toString()
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      createdAt: { $lt: new Date(createdAt) },
    })
      .limit(limit)
      .sort({ createdAt: -1 })
    res.status(200).json(messages)
  } catch (e) {
    console.log("Error in MessageController.getMessages: ", e)
    res.status(500).json("Internal server error")
  }
}

export const withdrawMessage = async (req, res) => {
  try {
    const { id } = req.params
    const { receiverId } = req.query
    const senderId = req.user._id.toString()
    const message = await Message.findById(id)
    if (message.senderId.toString() !== senderId) {
      return res.status(400).json({ error: "permission denied" })
    }
    const twoMinutesAgo = new Date().getTime() - 2 * 60 * 1000
    let createdAt = new Date(message.createdAt).getTime()
    if (createdAt >= twoMinutesAgo && createdAt <= new Date().getTime()) {
      const conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      })
      await Promise.all([
        Conversation.findByIdAndUpdate(conversation._id, {
          $pull: { messages: message._id },
        }),
        message.deleteOne(),
      ])
      // socket withdraw-message
      const receiverSocketId = getSocketIdByUserId(receiverId)
      const senderSocketId = getSocketIdByUserId(senderId)
      io.to([receiverSocketId, senderSocketId]).emit(
        "withdraw-message",
        message,
      )
      res.status(200).json({ id, message: "消息撤回成功" })
    } else {
      res.status(400).json({ error: "消息不在两分钟内，撤回失败" })
    }
  } catch (e) {
    res.status(500).json("Internal server error")
  }
}
