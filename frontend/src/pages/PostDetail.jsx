import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import PostCard, { PostSkeleton } from '../components/PostCard';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                // Fetch post and comments in parallel for speed
                const [postRes, commentsRes] = await Promise.all([
                    api.get(`/post/${id}`),
                    api.get(`/comment/post/${id}`) // Matches the route we made earlier
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data);
            } catch (error) {
                console.error("Failed to load post", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await api.post('/comment', { content: newComment, postId: id });
            setComments([res.data, ...comments]); // Add new comment to the top instantly
            setNewComment(''); // Clear input
        } catch (error) {
            alert("You must be logged in to comment.");
        }
    };

    if (loading) return <div className="max-w-2xl mx-auto mt-6"><PostSkeleton /></div>;
    if (!post) return <div className="text-center mt-10">Post not found</div>;

    return (
        <div className="max-w-2xl mx-auto mt-6 px-4 md:px-0">
            {/* The Main Post */}
            <PostCard post={post} />

            {/* Comment Section */}
            <div className="bg-white border border-gray-300 rounded-md p-4 mb-10">
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <p className="text-sm mb-1">Comment as <span className="font-bold">you</span></p>
                    <textarea 
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black min-h-[100px]"
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                        <button type="submit" className="bg-blue-500 text-white font-bold py-1 px-4 rounded-full hover:bg-blue-600 text-sm">
                            Comment
                        </button>
                    </div>
                </form>

                <div className="border-t border-gray-200 pt-4">
                    {comments.length > 0 ? comments.map(comment => (
                        <div key={comment._id} className="mb-4 text-sm">
                            <div className="font-bold mb-1">
                                u/{comment.authorId?.username || 'user'}
                            </div>
                            <div className="text-gray-800">{comment.content}</div>
                        </div>
                    )) : (
                        <div className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</div>
                    )}
                </div>
            </div>
        </div>
    );
}