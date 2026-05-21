import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import PostCard, { PostSkeleton } from '../components/PostCard';

export default function CommunityPage() {
    const { name } = useParams();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunityAndPosts = async () => {
            try {
                // 1. Get the community by name
                const commRes = await api.get(`/community/r/${name}`);
                setCommunity(commRes.data);
                
                // 2. Get posts for this specific community
                const postsRes = await api.get(`/post/community/${commRes.data._id}`);
                setPosts(postsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunityAndPosts();
    }, [name]);

    if (loading) return <div className="max-w-2xl mx-auto mt-6"><PostSkeleton /></div>;
    if (!community) return <div className="text-center mt-10">Community not found</div>;

    return (
        <div className="max-w-2xl mx-auto mt-6 px-4">
            {/* Community Header */}
            <div className="bg-white border border-gray-300 p-6 rounded-md mb-6">
                <h1 className="text-3xl font-bold">r/{community.name}</h1>
                <p className="text-gray-600 mt-2">{community.description}</p>
                <div className="mt-4">
                    <Link to={`/submit?communityId=${community._id}`} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600">
                        Create Post Here
                    </Link>
                </div>
            </div>

            {/* Community Posts Feed */}
            {posts.length > 0 ? (
                posts.map(post => <PostCard key={post._id} post={post} />)
            ) : (
                <div className="text-center text-gray-500 mt-10 border border-gray-300 bg-white p-6 rounded-md">
                    No posts here yet. Be the first!
                </div>
            )}
        </div>
    );
}