import Message from '../models/MessageModel.js'
import Conversation from '../models/ConversationModel.js'
import { getReceiverSocketId, io } from '../socket.js'

export const sendMessage = async (req, res) => {
	try {
		const { message, messageType = 'text' } = req.body
		const { id: receiverId } = req.params
		const senderId = req.user._id
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] }
		})

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId]
			})
		}
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
			messageType
		})

		if (newMessage) {
			conversation.messages.push(newMessage._id)
		}

		await Promise.all([conversation.save(), newMessage.save()])
		// socket
		const receiverSocketId = getReceiverSocketId(receiverId)
		if (receiverSocketId) {
			console.log(receiverSocketId, newMessage)
			io.to(receiverSocketId).emit('new-message', newMessage)
		}
		const senderSocketId = getReceiverSocketId(senderId)
		if (senderSocketId) {
			io.to(senderSocketId).emit('new-message', newMessage)
		}


		res.status(201).json(newMessage)
	} catch (e) {
		console.log('Error in MessageController.sendMessage: ', e)
		res.status(500).json('Internal server error')
	}
}

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params
		const senderId = req.user._id.toString()
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] }
		}).populate('messages')
		if (!conversation) {
			return res.status(200).json([])
		}
		res.status(200).json(conversation.messages)
	} catch (e) {
		console.log('Error in MessageController.getMessages: ', e)
		res.status(500).json('Internal server error')
	}
}