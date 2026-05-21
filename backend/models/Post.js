import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
    },
    mediaUrl: {
        type: String,
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;