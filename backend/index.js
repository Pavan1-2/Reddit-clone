import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors' // 1. Add this import
import connectDB from './db/db.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import communityRoutes from './routes/communityRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/comments.js'
dotenv.config()

const app = express()
connectDB()

// 2. Add this CORS configuration
app.use(cors({
    origin: "http://localhost:5173", // CHANGE THIS to your exact React frontend URL/port
    credentials: true // THIS IS REQUIRED for your auth cookies to work!
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my reddit clone" })
})

app.use("/api/auth", authRoutes)
app.use("/api/community", communityRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)

app.listen(process.env.PORT, () => {
    console.log("Server running at", process.env.PORT)
})