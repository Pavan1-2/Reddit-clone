import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router = express.Router()


router.post("/", async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        passwordHash: hashedPassword
    })

    const saved = await newUser.save()
    res.status(200).json({
        message: `${saved._id} has been created`
    })
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({
        userId: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "24h"
    })
    res.cookie("authToken", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 25 * 60 * 60 * 1000
    })

    res.status(200).json({ id: user._id, username: user.username })
})


router.post("/logout", async (req, res) => {
    res.clearCookie("authToken")
    res.status(200).json({ message: "Logged out successfully" })
})







export default router