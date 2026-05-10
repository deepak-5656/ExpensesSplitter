# Expense Splitter 💸

A modern full-stack expense management platform that helps users track personal spending, split bills with groups, and settle balances efficiently. The application also integrates a Machine Learning service for intelligent auto-categorization of expenses.

---

## ✨ Features

- 🔐 User Authentication & Authorization
- 👥 Group Expense Management
- 💰 Smart Bill Splitting & Settlements
- 📊 Expense Tracking Dashboard
- 🤖 ML-Powered Expense Categorization
- ⚡ Real-Time Updates with Socket.IO
- 📱 Responsive UI for Mobile & Desktop
- 📧 Email-Based Group Invitations
- 🧾 Transaction History & Balance Tracking

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO

### Machine Learning Service
- Python
- Flask
- Scikit-learn
- Pandas

---

# 🚀 Project Setup & Execution

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd ExpensesSplitter
```

---

## 🤖 Machine Learning Service Setup

The ML service automatically predicts expense categories such as Food, Travel, Shopping, Utilities, etc.

### Install Dependencies

```bash
cd ml-service
pip install flask flask-cors scikit-learn pandas
```

### Train the ML Model

```bash
python train_model.py
```

### Start the ML Server

```bash
python app.py
```

✅ Runs on: `http://localhost:5001`

---

## ⚙️ Backend Server Setup

The backend handles authentication, expenses, groups, settlements, database operations, and real-time communication.

### Install Dependencies

```bash
cd server
npm install
```

### Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

### Start Backend Server

```bash
npm run dev
```

✅ Runs on: `http://localhost:5000`

---

## 🎨 Frontend Client Setup

The frontend provides the complete user interface for expense tracking and group management.

### Install Dependencies

```bash
cd client
npm install
```

### Start Frontend

```bash
npm run dev
```

✅ Runs on: `http://localhost:3000`

---

## 📂 Project Structure

```bash
ExpensesSplitter/
│
├── client/         # React Frontend
├── server/         # Node.js Backend
├── ml-service/     # Python ML Service
├── README.md
└── LEARNING.md
```

---

## 📖 Learning Guide

The `LEARNING.md` file contains:
- Application Architecture
- Frontend Workflow
- Backend Workflow
- ML Integration
- Database Design
- Socket.IO Communication

---

## 🌟 Future Improvements

- 📈 Expense Analytics & Charts
- 🌍 Multi-Currency Support
- 📲 Progressive Web App (PWA)
- 🧠 AI Expense Insights
- 🔔 Push Notifications
- ☁️ Cloud File Uploads

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 👨‍💻 Author

Developed by **Deepak** 🚀
