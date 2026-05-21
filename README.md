Reddit Clone MVP

A full-stack Reddit-style social media platform where users can create communities, share posts, comment, and interact with other users. This project was developed as an MVP (Minimum Viable Product) focusing on core Reddit functionalities with a clean and responsive UI.

🚀 Features
🔐 Authentication
User Registration
User Login & Logout
JWT-based Authentication
Protected Routes
👥 Communities
Create Communities
Browse All Communities
Dedicated Community Pages
📝 Posts
Create Posts
View Posts by Community
Post Details Page
💬 Comments
Add Comments to Posts
View Comments Under Posts
📱 Responsive UI
Clean Reddit-inspired Interface
Mobile Responsive Design
Tailwind CSS Styling
🛠️ Tech Stack
Frontend
React.js
Vite
Tailwind CSS
React Router DOM
Axios
Backend
Node.js
Express.js
MongoDB
Mongoose
Authentication
JWT (JSON Web Tokens)
bcrypt.js
📂 Project Structure
reddit-clone/
│
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│
├── server/                 # Backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   └── server.js
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/reddit-clone.git
cd reddit-clone
🔧 Backend Setup
Navigate to Server Folder
cd server
Install Dependencies
npm install
Create .env File
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run Backend Server
npm run dev

Server runs on:

http://localhost:5000
🎨 Frontend Setup
Navigate to Client Folder
cd client
Install Dependencies
npm install
Run Frontend
npm run dev

Frontend runs on:

http://localhost:5173
🗄️ Database Models
User
Username
Email
Password
Community
Community Name
Description
Creator
Post
Title
Content
Author
Community
Comment
Content
Author
Post Reference
🔑 API Routes
Authentication
POST /api/auth/register
POST /api/auth/login
Communities
GET    /api/communities
POST   /api/communities
GET    /api/communities/:id
Posts
GET    /api/posts
POST   /api/posts
GET    /api/posts/:id
Comments
POST   /api/comments
GET    /api/comments/:postId
🎯 Future Improvements
Upvote / Downvote System
Real-time Notifications
Image Upload Support
Nested Comments
User Profiles
Trending Feed
Dark Mode
Real-time Chat
🔐 Security Features
Password Hashing using bcrypt
JWT Authentication
Protected API Routes
Input Validation
📸 Screenshots

Add your project screenshots here.

Example:

![Homepage](./screenshots/home.png)
🚀 Deployment
Frontend
Vercel
Netlify
Backend
Render
Railway
Database
MongoDB Atlas
🧠 Learning Outcomes

This project helped in understanding:

Full-stack web development
REST API creation
Authentication systems
Database design
Frontend-backend integration
Responsive UI development
👨‍💻 Author

Developed by Pavan

📄 License

This project is developed for educational and portfolio purposes.
