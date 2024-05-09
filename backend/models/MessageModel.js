import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	receiverId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	message: {
		type: String,
		required: true
	},
	messageType: {
		type: String,
		enum: ['text', 'image', 'video', 'audio', 'file'],
		required: true
	}
}, {timestamps: true})

const Message = mongoose.model('Message', MessageSchema)
export default Message