import express from 'express'
import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import { verifyToken } from '../middlewares/authenticate.js' // Adjust path if needed

const router = express.Router()

// 1. ADD A COMMENT TO A POST (Protected)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { content, postId } = req.body
        const authorId = req.user.userId

        // Quick check to ensure the post actually exists before commenting
        const postExists = await Post.findById(postId)
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" })
        }

        const newComment = new Comment({
            content,
            postId,
            authorId
        })

        const savedComment = await newComment.save()

        // Populate the author data before sending it back so the frontend 
        // can immediately display the commenter's username
        await savedComment.populate("authorId", "username")

        res.status(201).json(savedComment)
    } catch (error) {
        res.status(500).json({ message: "Failed to post comment", error: error.message })
    }
})

// 2. DISPLAY COMMENTS UNDER A POST (Public)
// URL: GET /api/comments/post/:postId
router.get("/post/:postId", async (req, res) => {
    try {
        const { postId } = req.params

        // Find all comments for this post, newest first
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .populate("authorId", "username")

        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message })
    }
})

export default router