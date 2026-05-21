import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { api } from './api';

// Pages
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Communities from './pages/Communities';
import CommunityPage from './pages/CommunityPage';

function App() {
  // Check if user exists in local storage to toggle Navbar buttons
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
      try {
          await api.post('/auth/logout');
      } catch (err) {
          console.error("Logout failed", err);
      }
      // Clear the user from storage and hard refresh to reset the UI
      localStorage.removeItem('user');
      window.location.href = '/'; 
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-200 pb-10">
        
        {/* Minimal Reddit Navbar */}
        <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 h-14 flex items-center px-4 justify-between shadow-sm">
            
            <div className="flex items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-orange-500 tracking-tight mr-6">
                    reddit<span className="text-black">clone</span>
                </Link>
                
                {/* Browse Communities Link */}
                <Link to="/communities" className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors hidden md:block">
                    Browse Communities
                </Link>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex space-x-3 items-center">
                {user ? (
                    <>
                        <span className="text-sm font-bold text-gray-600 hidden sm:block">
                            u/{user.username}
                        </span>
                        <Link to="/submit" className="text-sm font-bold bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition-colors">
                            Create Post
                        </Link>
                        <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-black px-2 transition-colors">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register" className="text-sm font-bold text-blue-500 hover:bg-blue-50 px-4 py-1.5 rounded-full transition-colors hidden sm:block">
                            Sign Up
                        </Link>
                        <Link to="/login" className="text-sm font-bold border border-blue-500 text-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors">
                            Log In
                        </Link>
                    </>
                )}
            </div>
        </nav>

        {/* Mobile Browse Link (Shows only on small screens below the navbar) */}
        <div className="md:hidden bg-white border-b border-gray-300 px-4 py-2">
            <Link to="/communities" className="text-sm font-bold text-blue-500 hover:underline">
                Explore All Communities →
            </Link>
        </div>

        {/* Main Routing Area */}
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/r/:name" element={<CommunityPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;