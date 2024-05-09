import User from '../models/UserModel.js'

export const getUsersForSidebar = async (req, res) => {
	try {
		const currentUser = req.user._id
		const users = await User.find({
			_id: { $ne: currentUser }
		}).select('-password')
		res.status(200).json(users)
	} catch (e) {
		res.status(500).json('Internal server error')
	}
}