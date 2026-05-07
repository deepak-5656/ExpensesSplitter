# Expense Splitter

A full-stack application for tracking personal expenses and splitting bills with groups, featuring ML-powered auto-categorization.

## 🚀 Setup & Execution
### 1. Machine Learning Service (Python)
The ML service categorizes expense titles into standard categories (Food, Transport, etc.).

```bash
cd ml-service
# Install dependencies
pip install flask flask-cors scikit-learn pandas
# Train the model
python train_model.py
# Start the service (runs on port 5001)
python app.py
```

### 2. Backend Server (Node.js)
The backend handles the core logic, database communication, and real-time sockets.

```bash
cd server
# Install dependencies
npm install
# Set up your MongoDB and Email credentials in .env
# Start the server (runs on port 5000)
npm run dev
```

### 3. Frontend Client (React + Vite)
The UI built with React and Tailwind CSS.

```bash
cd client
# Install dependencies
npm install
# Start the development server (runs on port 3000)
npm run dev
```

## 📖 Learning Guide
Check out the `LEARNING.md` file in the root directory for an explanation of the architecture, technologies chosen, and how the different services interact.
