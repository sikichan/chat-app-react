import express from 'express'
import dotenv from 'dotenv'

import connectMongodb from './db/connectMongodb.js'
import AuthRoutes from './routes/AuthRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000
dotenv.config()
// app.get('/', (req, res) => {
// 	res.send('Welcome to the server!')
// })
app.use(express.json())
app.use('/api/auth', AuthRoutes)


app.listen(PORT, () => {
	connectMongodb()
	console.log(`Server started on port ${PORT}`)
})