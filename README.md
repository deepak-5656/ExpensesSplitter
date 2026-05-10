Expense Splitter 💸

A modern full-stack expense management platform that helps users track personal spending, split bills seamlessly with groups, and settle balances efficiently. The application also integrates a Machine Learning service for intelligent auto-categorization of expenses.

✨ Features
🔐 User Authentication & Authorization
👥 Group Expense Management
💰 Smart Bill Splitting & Settlements
📊 Expense Tracking Dashboard
🤖 ML-Powered Expense Categorization
⚡ Real-Time Updates with Socket.IO
📱 Responsive UI for Mobile & Desktop
📧 Email-Based Group Invitations
🧾 Transaction History & Balance Tracking
🛠️ Tech Stack
Frontend
React.js + Vite
Tailwind CSS
Axios
Socket.IO Client
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Socket.IO
Machine Learning Service
Python
Flask
Scikit-learn
Pandas
🚀 Project Setup & Execution
1️⃣ Clone the Repository
git clone <YOUR_GITHUB_REPO_URL>
cd ExpensesSplitter
🤖 Machine Learning Service Setup

The ML service automatically predicts expense categories such as Food, Travel, Shopping, Utilities, etc.

cd ml-service

# Install dependencies
pip install flask flask-cors scikit-learn pandas

# Train the ML model
python train_model.py

# Start the ML server
python app.py

Runs on: http://localhost:5001

⚙️ Backend Server Setup

The backend manages authentication, expenses, groups, settlements, database operations, and real-time communication.

cd server

# Install dependencies
npm install
Create .env File
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
Start Backend Server
npm run dev

Runs on: http://localhost:5000

🎨 Frontend Client Setup

The frontend provides the user interface for managing expenses and groups.

cd client

# Install dependencies
npm install

# Start frontend
npm run dev

 Runs on: http://localhost:3000

📂 Project Structure
ExpensesSplitter/
│
├── client/         # React Frontend
├── server/         # Node.js Backend
├── ml-service/     # Python ML Service
├── README.md
└── LEARNING.md
📖 Learning Guide

A detailed explanation of:

Application Architecture
Backend Workflow
Frontend Structure
ML Integration
Socket Communication
Database Design

is available inside:

LEARNING.md
🌟 Future Improvements
📈 Expense Analytics & Charts
🌍 Multi-Currency Support
📲 Progressive Web App (PWA)
🧠 Advanced AI Expense Insights
🔔 Push Notifications
☁️ Cloud File Uploads
🤝 Contributing

Contributions are welcome!

Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Open a Pull Request
