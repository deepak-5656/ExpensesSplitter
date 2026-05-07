# Learning Guide: Building the Expense Splitter

Welcome to your learning guide! As we build this full-stack application, this document will explain **what** each part does, **why** we chose it, and **how** it works together. 

## 1. The Architecture (MERN + Python)
We are building a "Full-Stack" application. This means we have a frontend (what the user sees), a backend (the logic and database), and a machine learning service (for smart categorization).

- **Frontend (React & Vite):** React allows us to build reusable UI components (like a `GroupCard` or `ExpenseCard`). We use Vite instead of Create React App because it's much faster for development. Tailwind CSS is used for styling because it lets us style components directly in the HTML/JSX without jumping back and forth between CSS files.
- **Backend (Node.js & Express):** This is our API server. When the frontend needs data (like "get all my expenses"), it asks the Node backend. Express makes it easy to set up these "routes" (endpoints).
- **Database (MongoDB):** This is a NoSQL database, meaning it stores data in JSON-like documents. This is perfect for JavaScript applications because the data format is native to JS. Mongoose is the library we use to talk to MongoDB.
- **ML Service (Python & Flask):** Why not use Node.js for ML? Python has the best ecosystem for Machine Learning (`scikit-learn`, `pandas`). We create a small Flask API so our Node.js backend can send an expense title (e.g., "Dominos Pizza") to the Python server, which returns the predicted category ("Food").

## 2. Machine Learning (Naive Bayes & TF-IDF)
In `train_model.py`, we provide examples of expenses.
- **TF-IDF (Term Frequency-Inverse Document Frequency):** This converts text into numbers. It figures out which words are important. For example, in "Uber ride", "Uber" is highly indicative of transport.
- **Naive Bayes:** This is a probabilistic algorithm. Based on the training data, it calculates the probability that "Dominos" belongs to "Food" versus "Shopping". We save the trained model into `model.pkl` so the `app.py` server doesn't have to retrain every time.

## 3. Real-time Communication (Socket.io)
Normally, when someone adds an expense, you have to refresh the page to see it. `Socket.io` allows "push" notifications. Our server pushes the new expense to all connected clients instantly, so your friend sees the updated balance live!

## 4. Security (JWT & bcrypt)
- **bcrypt:** We never store plain text passwords in the database. bcrypt "hashes" the password into a scrambled string.
- **JWT (JSON Web Tokens):** When you log in, the server gives you a JWT. Think of it as a VIP wristband. For every subsequent request (like adding an expense), you show this wristband (in the HTTP headers) so the server knows who you are without asking for your password again.

*As we build out each folder, refer back to this document to understand how the pieces fit into the big picture!*
