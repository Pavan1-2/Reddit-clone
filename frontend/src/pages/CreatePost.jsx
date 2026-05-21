import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';

export default function CreatePost() {
    const [searchParams] = useSearchParams();
    const preselectedCommunity = searchParams.get('communityId') || '';

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [communityId, setCommunityId] = useState(preselectedCommunity);
    const [communities, setCommunities] = useState([]); // Store communities for dropdown
    const [error, setError] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const navigate = useNavigate();

    // Fetch communities when page loads
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await api.get('/community');
                setCommunities(res.data);
                // Auto-select first community if none is selected
                if (!preselectedCommunity && res.data.length > 0) {
                    setCommunityId(res.data[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch communities", error);
            }
        };
        fetchCommunities();
    }, [preselectedCommunity]);

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await api.post('/post', { title, content, communityId, mediaUrl }); 
        navigate(`/post/${res.data._id}`);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to create post');
    }
};

    return (
        <div className="max-w-2xl mx-auto mt-6 px-4 md:px-0">
            <div className="bg-white border border-gray-300 p-6 rounded-md">
                <h1 className="text-xl font-bold mb-4 border-b pb-2">Create a post</h1>
                
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {/* The Dropdown Fix */}
                    <select 
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-black bg-white"
                        value={communityId}
                        onChange={(e) => setCommunityId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Choose a community...</option>
                        {communities.map(comm => (
                            <option key={comm._id} value={comm._id}>r/{comm.name}</option>
                        ))}
                    </select>

                    <input 
                        type="text" 
                        placeholder="Title" 
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-black font-semibold"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                    />
                    <input 
                        type="url" 
                        placeholder="Image/Media URL (optional)" 
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-black"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                    />
                    <textarea 
                        placeholder="Text (optional)" 
                        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-black min-h-[150px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white font-bold py-1.5 px-6 rounded-full hover:bg-blue-600">
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}