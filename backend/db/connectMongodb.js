import mongoose from 'mongoose'

const connectMongodb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI)
		console.log(`Connected to mongodb`)
	} catch (err) {
		console.log('MongoDB connection error:', err.message)
	}
}
export default connectMongodb