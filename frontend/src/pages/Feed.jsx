import { useEffect, useState } from 'react';
import { api } from '../api';
import PostCard, { PostSkeleton } from '../components/PostCard';

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('latest'); // 'latest' or 'popular'

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // For MVP, you can fetch all posts or a specific community
                // Assuming you created a GET /api/post route that returns all posts
                const res = await api.get('/post');
                let fetchedPosts = res.data;

                // Frontend Sorting Logic
                if (sort === 'latest') {
                    fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else if (sort === 'popular') {
                    fetchedPosts.sort((a, b) => {
                        const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
                        const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
                        return scoreB - scoreA;
                    });
                }
                
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [sort]);

    return (
        <div className="max-w-2xl mx-auto mt-6 px-4 md:px-0">
            {/* Sorting Navigation */}
            <div className="bg-white border border-gray-300 rounded-md p-3 mb-4 flex space-x-4">
                <button 
                    onClick={() => setSort('latest')}
                    className={`font-bold py-1 px-3 rounded-full ${sort === 'latest' ? 'bg-gray-200 text-black' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Latest
                </button>
                <button 
                    onClick={() => setSort('popular')}
                    className={`font-bold py-1 px-3 rounded-full ${sort === 'popular' ? 'bg-gray-200 text-black' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Popular
                </button>
            </div>

            {/* Feed Content */}
            {loading ? (
                <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </>
            ) : posts.length > 0 ? (
                posts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
                <div className="text-center text-gray-500 mt-10">No posts found. Create one!</div>
            )}
        </div>
    );
}