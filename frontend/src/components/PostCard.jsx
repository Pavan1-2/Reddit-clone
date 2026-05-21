import { ArrowBigUp, ArrowBigDown, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { api } from '../api';

// The Skeleton UI for loading states
export const PostSkeleton = () => (
    <div className="flex bg-white border border-gray-300 rounded-md mb-4 animate-pulse">
        <div className="w-10 bg-gray-100 p-2 rounded-l-md"></div>
        <div className="p-2 pt-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
    </div>
);

// The Actual Post Component
export default function PostCard({ post }) {
    const [votes, setVotes] = useState(post.upvotes?.length - post.downvotes?.length || 0);

    const handleVote = async (action) => {
        try {
            // Optimistic UI update could go here, but for safety, we wait for backend
            const res = await api.post(`/post/${post._id}/vote`, { action });
            setVotes(res.data.netVotes);
        } catch (error) {
            alert("You must be logged in to vote!");
        }
    };

    return (
        <div className="flex bg-white border border-gray-300 rounded-md mb-4 hover:border-gray-400 transition-colors">
            {/* Left Column: Voting */}
            <div className="w-10 bg-gray-50 p-2 flex flex-col items-center rounded-l-md border-r border-gray-100">
                <button onClick={() => handleVote('upvote')} className="text-gray-400 hover:text-orange-500">
                    <ArrowBigUp size={24} />
                </button>
                <span className="font-bold text-sm my-1">{votes}</span>
                <button onClick={() => handleVote('downvote')} className="text-gray-400 hover:text-blue-500">
                    <ArrowBigDown size={24} />
                </button>
            </div>

            {/* Right Column: Content */}
            <div className="p-2 pt-2 flex-1">
                <div className="text-xs text-gray-500 mb-1">
                    <Link to={`/r/${post.communityId?.name}`} className="font-bold text-black hover:underline mr-1">
                        r/{post.communityId?.name || 'community'}
                    </Link>
                    • Posted by u/{post.authorId?.username || 'user'} {formatDistanceToNow(new Date(post.createdAt))} ago
                </div>
                
               <Link to={`/post/${post._id}`}>
                    <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                    <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                    
                    {/* ADD THIS BLOCK: Render image if mediaUrl exists */}
                    {post.mediaUrl && (
                        <div className="mb-3 rounded-md overflow-hidden bg-gray-50 border border-gray-200 flex justify-center">
                            <img 
                                src={post.mediaUrl} 
                                alt="Post media" 
                                className="max-w-full max-h-[400px] object-contain"
                                onError={(e) => e.target.style.display = 'none'} // Hides broken image links
                            />
                        </div>
                    )}
                </Link>
                {/* CTAs */}
                <div className="flex items-center text-gray-500 text-xs font-bold space-x-4">
                    <Link to={`/post/${post._id}`} className="flex items-center space-x-1 hover:bg-gray-100 p-1.5 rounded">
                        <MessageSquare size={18} />
                        <span>Comments</span>
                    </Link>
                    {/* Add more CTAs like Share or Save here if needed */}
                </div>
            </div>
        </div>
    );
}