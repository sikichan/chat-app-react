import Message from "../models/MessageModel.js"
import Conversation from "../models/ConversationModel.js"
import { getSocketIdByUserId, io } from "../socket.js"
import User from "../models/UserModel.js"

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
        isGroup: false,
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

    await Promise.all([
      conversation.save(),
      (await newMessage.save()).populate({
        path: "senderId",
        ref: "Users",
        select: "_id fullName avatar",
      }),
    ])
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

export const sendMessageInGroup = async (req, res) => {
  try {
    const { message, messageType = "text", id: conversationId } = req.body
    const senderId = req.user._id
    let conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return res.status(400).json("群组不存在")
    }
    const newMessage = new Message({
      senderId,
      groupId: conversation._id,
      message,
      messageType,
    })
    if (newMessage) {
      conversation.messages.push(newMessage._id)
    }

    await Promise.all([conversation.save(), newMessage.save()])
    // socket new-message-group
    //const receiverSocketId = getSocketIdByUserId(receiverId)
    //if (receiverSocketId) {
    //  io.to(receiverSocketId).emit("new-message", newMessage)
    //}
    //const senderSocketId = getSocketIdByUserId(senderId)
    //if (senderSocketId) {
    //  io.to(senderSocketId).emit("new-message", newMessage)
    //}
    //io.in(conversationId).emit("new-message", newMessage)
    const sender = await User.findById(senderId).select("_id fullName avatar")
    newMessage.senderId = sender
    io.in(conversation._id.toString()).emit("new-message-group", newMessage)
    //let memberIds = conversation.members.map((id) => id.toString())
    //memberIds = memberIds.filter((id) => id !== senderId)
    //console.log("members: ", memberIds)
    //memberIds.forEach((id) => {
    //  const socketId = getSocketIdByUserId(id)
    //  if (socketId) {
    //    io.in(socketId).emit("new-message-group", {
    //      ...newMessage,
    //      senderId: sender,
    //    })
    //  }
    //})
    res.status(201).json(newMessage)
  } catch (e) {
    console.log("Error in MessageController.sendMessage: ", e)
    res.status(500).json("Internal server error")
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params
    let createdAt = parseInt(req.query.createdAt)
    const isGroup = Boolean(req.query.isGroup)
    const limit = 10
    const senderId = req.user._id.toString()
    let messages
    if (isGroup) {
      messages = await Message.find({
        groupId: id,
        createdAt: { $lt: new Date(createdAt) },
      })
        .populate({
          path: "senderId",
          ref: "Users",
          select: "_id fullName avatar",
        })
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec()
    } else {
      messages = await Message.find({
        $or: [
          { senderId, receiverId: id },
          { senderId: id, receiverId: senderId },
        ],
        createdAt: { $lt: new Date(createdAt) },
      })
        .populate({
          path: "senderId",
          ref: "Users",
          select: "_id",
        })
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec()
    }
    res.status(200).json(messages)
  } catch (e) {
    console.log("Error in MessageController.getMessages: ", e)
    res.status(500).json("Internal server error")
  }
}

export const withdrawMessage = async (req, res) => {
  try {
    const { id } = req.params
    const { receiverId, groupId } = req.query
    const senderId = req.user._id.toString()
    const isGroup = Boolean(req.query.isGroup)
    let message, query
    if (isGroup) {
      message = await Message.findById(id).populate({
        path: "senderId",
        ref: "User",
        select: "_id fullName",
      })
      query = { _id: groupId }
    } else {
      message = await Message.findById(id).populate({
        path: "senderId",
        ref: "User",
        select: "_id fullName",
      })
      query = { members: { $all: [senderId, receiverId] } }
    }
    if (message.senderId._id.toString() !== senderId) {
      return res.status(400).json("permission denied")
    }
    const twoMinutesAgo = new Date().getTime() - 2 * 60 * 1000
    let createdAt = new Date(message.createdAt).getTime()
    if (createdAt >= twoMinutesAgo && createdAt <= new Date().getTime()) {
      const conversation = await Conversation.findOne(query)
      await Promise.all([
        Conversation.findByIdAndUpdate(conversation._id, {
          $pull: { messages: message._id },
        }),
        message.deleteOne(),
      ])
      // socket withdraw-message
      if (isGroup) {
        io.to(conversation._id.toString()).emit("withdraw-message", message)
      } else {
        const receiverSocketId = getSocketIdByUserId(receiverId)
        const senderSocketId = getSocketIdByUserId(senderId)
        io.to([receiverSocketId, senderSocketId]).emit(
          "withdraw-message",
          message,
        )
      }
      res.status(200).json({ id, message: "消息撤回成功" })
    } else {
      res.status(500).json("消息不在两分钟内，撤回失败")
    }
  } catch (e) {
    console.log(e)
    res.status(500).json("Internal server error")
  }
}
