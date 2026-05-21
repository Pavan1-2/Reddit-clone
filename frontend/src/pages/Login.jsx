import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

   const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { username, password });
            
            // Save the user data so the Navbar knows we are logged in
            // Make sure your backend login route actually sends { user: { username: "..." } }
            localStorage.setItem('user', JSON.stringify(res.data.user || { username })); 
            
            // Force a hard redirect to refresh the Navbar state instantly
            window.location.href = '/'; 
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-48px)] px-4">
            <div className="bg-white border border-gray-300 p-6 rounded-md w-full max-w-sm shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Log In</h1>
                
                {error && <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">{error}</div>}
                
                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="border border-gray-300 bg-gray-50 rounded p-2 focus:outline-none focus:border-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="border border-gray-300 bg-gray-50 rounded p-2 focus:outline-none focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" className="bg-orange-500 text-white font-bold py-2 rounded-full hover:bg-orange-600 transition">
                        Log In
                    </button>
                </form>
                
                <div className="mt-4 text-sm text-gray-500">
                    New to RedditClone? <Link to="/register" className="text-blue-500 font-bold hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}