import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await api.post('/auth/', { username, email, password });
            // After successful registration, send them to login
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating account');
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-48px)] px-4">
            <div className="bg-white border border-gray-300 p-6 rounded-md w-full max-w-sm shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                
                {error && <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">{error}</div>}
                
                <form onSubmit={handleRegister} className="flex flex-col space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        className="border border-gray-300 bg-gray-50 rounded p-2 focus:outline-none focus:border-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="border border-gray-300 bg-gray-50 rounded p-2 focus:outline-none focus:border-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" className="bg-blue-500 text-white font-bold py-2 rounded-full hover:bg-blue-600 transition">
                        Sign Up
                    </button>
                </form>
                
                <div className="mt-4 text-sm text-gray-500">
                    Already a redditor? <Link to="/login" className="text-blue-500 font-bold hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}