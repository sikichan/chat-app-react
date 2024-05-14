import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

export const isLoggedIn = async (req, res, next) => {
	try {
		const token = req.cookies.token
		if (!token) {
			return res.status(401).json({ error: 'Authentication token required' })
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		if (!decoded) {
			return res.status(401).json({ error: 'Authentication invalid token' })
		}
		const user = await User.findById(decoded.userId).select('-password')
		if (!user) {
			return res.status(401).json({ error: 'User does not exist' })
		}
		req.user = user // current logged user
		next()
	} catch (e) {
		console.error(`Error in Logged Middleware :`, e)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}
