import User from "../models/UserModel.js"
import bcrypt from "bcryptjs"
import generateJWTAndSetCookie from "../utils/generateToken.js"
import { io } from "../socket.js"

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmedPassword, gender } = req.body
    if (password !== confirmedPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }
    const user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({ error: "Username already exists" })
    }
    // https://avatar.iran.liara.run/public/boy?username=sikichan
    const genderScope = gender === "boy" ? "boy" : "girl"
    const avatarUrl = `https://avatar.iran.liara.run/public/${genderScope}?username=${username}`
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      avatar: avatarUrl,
    })
    if (newUser) {
      generateJWTAndSetCookie(newUser._id, res)
      await newUser.save()
      const data = {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        avatar: newUser.avatar,
        gender: newUser.gender,
      }
      // socket new-user
      io.emit("new-user", data)
      res.status(201).json(data)
    } else {
      res.status(400).json({ error: "Invalid user data" })
    }
  } catch (e) {
    res.status(500).json({ error: `Internal Server Error: ${e}` })
  }
}
export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ error: "Username not exists" })
    const passwordIsCorrect = await bcrypt.compare(password, user.password)
    if (!passwordIsCorrect) {
      return res.status(400).json({ error: "Invalid Password" })
    } else {
      generateJWTAndSetCookie(user._id, res)
      res.status(200).json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
      })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
export const logout = async (req, res) => {
  // await new Promise(resolve => setTimeout(resolve, 3000))
  try {
    res.cookie("token", "", {
      maxAge: 0,
    })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
