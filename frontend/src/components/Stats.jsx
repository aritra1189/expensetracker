import { useEffect, useState } from 'react';
import axios from 'axios';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

// Styled Paper component
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

export default function Stats() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const fetchStats = async () => {
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    try {
      const incomeRes = await axios.post("http://localhost:5050/api/v1/total-income", {
        userId,
      });

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
  }, [userId]);

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <h3 style={{ color: '#fff', marginBottom: '16px' }}>Financial Stats</h3>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Item>
            <h4>Total Income</h4>
            <p style={{ color: 'green', fontWeight: 'bold', fontSize: '20px' }}>
              ₹{totalIncome.toFixed(2)}
            </p>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <h4>Total Expense</h4>
            <p style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>
              ₹{totalExpense.toFixed(2)}
            </p>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <h4>Current Balance</h4>
            <p style={{ color: 'blue', fontWeight: 'bold', fontSize: '20px' }}>
              ₹{balance.toFixed(2)}
            </p>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

