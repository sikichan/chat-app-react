import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	gender: {
		type: String,
		required: true,
		enum: ['boy', 'girl']
	},
	avatar: {
		type: String,
		default: ''
	}
})

const User = mongoose.model('User', UserSchema)
export default User