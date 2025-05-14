import  { useEffect, useState } from 'react';
import axios from 'axios';

function Stats() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  // Get user ID dynamically from localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const fetchStats = async () => {
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    try {
      // Fetch total income
      const incomeRes = await axios.post("http://localhost:5050/api/v1/total-income", {
        userId,
      });

      // Fetch total expense
      const expenseRes = await axios.post("http://localhost:5050/api/v1/total-expense", {
        userId,
      });

      const income = incomeRes.data.totalIncome || 0;
      const expense = expenseRes.data.totalExpense || 0;
      const currentBalance = income - expense;

      setTotalIncome(income);
      setTotalExpense(expense);
      setBalance(currentBalance);
    } catch (error) {
      console.error("Error fetching stats:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-xl text-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">Financial Stats</h3>
      <h4>Total Income: ₹{totalIncome}</h4>
      <h4>Total Expense: ₹{totalExpense.toFixed(2)}</h4>
      <h4>Current Balance: ₹{balance.toFixed(2)}</h4>
    </div>
  );
}

export default Stats;
