import express from 'express'
import Post from '../models/Post.js'
import Community from '../models/Community.js'
import verifyToken from '../middlewares/authenticate.js'
const router = express.Router()

router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, content, mediaUrl, communityId } = req.body
        const authorId = req.user.userId

        const communityExists = await Community.findById(communityId)
        if (!communityExists) {
            return res.status(404).json({ message: "Community not found" })
        }

        const newPost = new Post({
            title,
            content,
            mediaUrl,
            communityId,
            authorId
        })

        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch (error) {
        res.status(500).json({ message: "Failed to create post", error: error.message })
    }
})

router.get("/", async (req, res) => {
    try {
        // Find all posts and populate the author and community details
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by newest by default
            .populate("authorId", "username")
            .populate("communityId", "name");

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
});


router.get("/community/:communityId", async (req, res) => {
    try {
        const { communityId } = req.params

        // Find posts and sort by newest first (fulfills your "Sort by Latest" requirement)
        const posts = await Post.find({ communityId })
            .sort({ createdAt: -1 })
            .populate("authorId", "username") // Only grab the username, ignore password/email
            .populate("communityId", "name")

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message })
    }
})

// 3. POST DETAIL PAGE (Public Route)
// Example URL: GET /api/posts/60d5ec49f1... (Post ID)
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params

        const post = await Post.findById(postId)
            .populate("authorId", "username")
            .populate("communityId", "name")

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        res.status(200).json(post)
    } catch (error) {
        // If the ID is malformed, Mongoose throws a CastError, so we catch it here
        res.status(500).json({ message: "Error fetching post", error: error.message })
    }
})

// VOTE ON A POST (Protected Route)
// URL: POST /api/posts/:postId/vote
// Body: { "action": "upvote" } OR { "action": "downvote" }

router.post("/:postId/vote", verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { action } = req.body; // "upvote" or "downvote"
        const userId = req.user.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user has already voted
        const hasUpvoted = post.upvotes.includes(userId);
        const hasDownvoted = post.downvotes.includes(userId);

        if (action === "upvote") {
            if (hasUpvoted) {
                // If already upvoted, clicking again removes the vote
                post.upvotes.pull(userId);
            } else {
                // Remove downvote if it exists, then add upvote
                if (hasDownvoted) post.downvotes.pull(userId);
                post.upvotes.push(userId);
            }
        } else if (action === "downvote") {
            if (hasDownvoted) {
                // If already downvoted, clicking again removes the vote
                post.downvotes.pull(userId);
            } else {
                // Remove upvote if it exists, then add downvote
                if (hasUpvoted) post.upvotes.pull(userId);
                post.downvotes.push(userId);
            }
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        const updatedPost = await post.save();

        // Send back the calculated vote count immediately
        const netVotes = updatedPost.upvotes.length - updatedPost.downvotes.length;

        res.status(200).json({
            message: "Vote registered",
            netVotes: netVotes,
            upvotes: updatedPost.upvotes.length,
            downvotes: updatedPost.downvotes.length,
            post: updatedPost
        });

    } catch (error) {
        res.status(500).json({ message: "Error voting", error: error.message });
    }
});



export default router