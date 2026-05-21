import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Communities() {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await api.get('/community');
                setCommunities(res.data);
            } catch (error) {
                console.error("Failed to fetch communities", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunities();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading communities...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-6 px-4">
            <h1 className="text-2xl font-bold mb-4">Browse Communities</h1>
            <div className="bg-white border border-gray-300 rounded-md">
                {communities.map(community => (
                    <div key={community._id} className="border-b border-gray-200 p-4 last:border-0 flex justify-between items-center">
                        <div>
                            <Link to={`/r/${community.name}`} className="text-lg font-bold text-black hover:underline">
                                r/{community.name}
                            </Link>
                            <p className="text-sm text-gray-500">{community.description}</p>
                        </div>
                        <Link to={`/r/${community.name}`} className="bg-blue-500 text-white font-bold py-1 px-4 rounded-full text-sm hover:bg-blue-600">
                            View
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}