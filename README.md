#Expense Tracker App

A full-featured Expense Tracker application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It allows users to manage income and expenses, track their balance, and view a detailed transaction history with a user-friendly interface.

---

##  Features

-  User authentication (register/login/logout)
-  Add, edit, and delete income or expense transactions
-  Calculate total income, total expenses, and current balance
-  Filter transactions by type
-  Dynamic statistics using MongoDB aggregation
-  REST API using Express & Mongoose
-  Clean, responsive UI built with React + Tailwind CSS

---

##  Tech Stack

**Frontend**:
- React
- Axios
- Tailwind CSS

**Backend**:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (authentication)
- dotenv

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
├── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add the following:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

---



## 💻 Screenshots

![image](https://github.com/user-attachments/assets/e84a1699-ece6-473a-b0c0-52b45328fa23)
![image](https://github.com/user-attachments/assets/ab14eff5-61aa-42f1-8963-e07d02f8adcc)
![image](https://github.com/user-attachments/assets/d933e1ee-b212-4d49-aa7a-3a8c40826205)



