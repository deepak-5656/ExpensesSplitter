# 🧠 Learning Guide: Building the Expense Splitter

Welcome to your comprehensive learning guide! This document explains exactly **what** each part of your application does, **why** we chose these methods, and **how** the complex logic works under the hood. You can use this guide to prepare for your project showcase and understand every "pin to pine" detail.

---

## 1. The Architecture (MERN + Python)
We built a "Full-Stack Distributed System". This means we have a frontend, a backend database, and a separate microservice for Machine Learning.

- **Frontend (React & Vite):** React allows us to build reusable UI components (like `QRModal` or `ExpenseCard`). We use Vite because its Hot Module Replacement (HMR) is incredibly fast. Tailwind CSS is used for styling directly in the JSX, allowing us to build the stunning monochrome theme.
- **Backend (Node.js & Express):** This is our API server. When the frontend needs data, it hits Express "routes" (endpoints). It acts as the middleman between the database and the user.
- **Database (MongoDB Atlas):** This is a cloud NoSQL database. Instead of rigid tables, it stores data in JSON-like "documents", which is native and highly efficient for JavaScript applications.
- **ML Microservice (Python & Flask):** Python dominates the AI ecosystem. Instead of forcing Node.js to do Machine Learning, we built a microservice architecture. Node.js sends the expense title to Python (port 5001), Python predicts the category, and sends it back to Node in milliseconds.

---

## 2. Advanced Machine Learning (TF-IDF & Char N-Grams)
Your project uses robust Natural Language Processing (NLP) to categorize expenses automatically.

- **The Typo Problem:** Originally, if a user typed "haricut" instead of "haircut", the model crashed or defaulted to "Food" because it only looked for exact, perfect dictionary words.
- **The Solution (Character N-Grams):** We upgraded the `TfidfVectorizer` to use `analyzer='char_wb', ngram_range=(3, 5)`. 
  - Instead of looking at the whole word, it chops text into small chunks. "haricut" becomes `["har", "ari", "ric", "icu", "cut"]`. 
  - The model recognizes the chunk `"cut"` and mathematically matches it to the training data for "haircut" (Personal Care). This makes your app highly resilient to human typos!
- **Naive Bayes Algorithm:** It calculates probabilities. Based on your expanded training data, it mathematically determines the highest probability that "Zomato" belongs to Food rather than Transport.

---

## 3. The Mathematics of Expense Splitting
The core engine of the app is how it calculates debts without getting confused.

- **The Split Array:** When you add an expense, the app creates a `splitAmong` array inside the database document. If you pay ₹300 equally among 3 people, it assigns a `share` of ₹100 to each user ID in that array.
- **The Zero-Sum Logic:** To calculate balances, the code iterates over all expenses:
  1. It *adds* the full amount to the person who paid it (`+300`).
  2. It *subtracts* the share from everyone involved (`-100` each).
  3. Result: The payer is `+200`, and the other two are `-100` each. Total sum of the system is exactly ₹0.
- **The Timing Rule:** If you add an expense *before* a friend joins the group, the friend's ID is not in the `splitAmong` array. Therefore, the app correctly charges 100% of the cost to you. **Past expenses are never retroactively forced onto new members.**

---

## 4. Secure Group Invitations (JWT Tokens)
How does a simple link automatically securely add a user to a group?

- **JSON Web Tokens (JWT):** When you click "Invite", the backend creates an encrypted JWT. This token contains the unique `Group ID` wrapped inside a tamper-proof signature.
- **The Flow:** 
  1. The token is appended to the URL (`/join/eyJhb...`). 
  2. When the friend clicks it, the React app reads the URL and checks if they are logged in.
  3. If they are logged in, React sends that token back to the Express backend.
  4. The backend decrypts the JWT. Because it is mathematically signed, the backend *trusts* it, extracts the Group ID, and pushes the user's ID into the group's member list in MongoDB.

---

## 5. Live QR Code Settlements (UPI Deep Linking)
We built a real-time system to handle the physical transfer of money.

- **Dynamic Database Profiles:** We updated the User schema so users can save their real `upiId` to the database.
- **Deep Linking Protocol:** When a user owes you money, they click "Pay". The React app fetches your specific UPI ID from the database and constructs a UPI Deep Link: 
  `upi://pay?pa=your_upi_id&pn=Your_Name&am=500.00&cu=INR`
- **QR Code Generation:** The `react-qr-code` library instantly converts this text string into a scannable 2D barcode. When scanned by PhonePe/GPay, the phone's OS intercepts the `upi://` protocol and forces the banking app to open, auto-filling the exact amount and recipient!
- **"Mark as Paid" Logic:** Once the real money is sent, clicking "Mark as Paid" triggers the backend to create a **Settlement Transaction**. It creates an invisible expense where the debtor "paid" the creditor. This perfectly reverses the math (Step 3), dropping both balances back to `₹0.00`!

---

## 6. Real-time WebSockets (Socket.io)
Normally, HTTP requires you to refresh the page to see changes. We implemented `Socket.io` to create a permanent, open pipe between the server and the browser.
- When someone clicks "Mark as Paid", the backend saves it to MongoDB.
- It then instantly broadcasts a message (`expense:added` or `expense:settled`) through the Socket pipe.
- The React frontend receives this signal and updates the UI instantly, without anyone needing to refresh the page!
