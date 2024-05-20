import jwt from "jsonwebtoken"

export const generateJWTAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
  res.cookie("token", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  })
}
export default generateJWTAndSetCookie
