import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";
import mongoose from "mongoose";
export const addTransactionController = async (req, res) => {
  try {
    const {
      title,
      amount,
      description,
      date,
      category,
      method,
      subcategory,
      userId,
      transactionType,
    } = req.body;

    // console.log(title, amount, description, date, category, userId, transactionType);

    if (
      !title ||
      !amount ||
      !description ||
      !date ||
      !category ||
      !transactionType||
      !subcategory||
      !method
    ) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let newTransaction = await Transaction.create({
      title: title,
      amount: amount,
      category: category,
      subcategory: subcategory,
      description: description,
      method: method,
      date: date,
      user: userId,
      transactionType: transactionType,
    });

    user.transactions.push(newTransaction);

    user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction Added Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

   
    console.log("Request Payload:", req.body);

 
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ success: false, message: "User not found" });
    }
    console.log("User found:", user);

   
    const query = { user: userId }; 

   
    if (type !== "all") {
      query.transactionType = type;
      console.log("Transaction type filter:", type);
    }

    
    if (frequency !== "custom") {
      const daysAgo = moment().subtract(Number(frequency), "days").toDate();
      query.date = { $gt: daysAgo };
      console.log("Filtering transactions newer than:", daysAgo);
    } else if (startDate && endDate && startDate !== "null" && endDate !== "null") {
      query.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate(), 
       };

      console.log("Filtering by custom range:", query.date);
    }

   
    if (query.date && !startDate && !endDate && !frequency) {
      console.log("No transactions found for the last 7 days or selected date range.");
    }

   
    console.log("Query:", JSON.stringify(query, null, 2));
    const transactions = await Transaction.find(query).sort({ date: -1 }).populate('user', 'name email'); // Populate user data

    
    console.log("Transactions found:", transactions);


    if (transactions.length === 0) {
      console.log("No transactions found.");
      return res.status(200).json({
        success: true,
        transactions: [],
        message: "No transactions found for the given filters.",
      });
    }


    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error("Controller error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const transactionElement = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    const transactionArr = user.transactions.filter(
      (transaction) => transaction._id === transactionId
    );

    user.transactions = transactionArr;

    user.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction successfully deleted`,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const { title, amount, description, date, category,subcategory, method,transactionType } =
      req.body;

    console.log(title, amount, description, date, category,subcategory,method, transactionType);

    const transactionElement = await Transaction.findById(transactionId);

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if (title) {
      transactionElement.title = title;
    }

    if (description) {
      transactionElement.description = description;
    }

    if (amount) {
      transactionElement.amount = amount;
    }

    if (category) {
      transactionElement.category = category;
    }
    if (transactionType) {
      transactionElement.transactionType = transactionType;
    }

    if (date) {
      transactionElement.date = date;
    }
    if (subcategory) {
      transactionElement.subcategory = subcategory;
    }
    if (method) {
      transactionElement.method = method;
    }


    await transactionElement.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction Updated Successfully`,
      transaction: transactionElement,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};



export const getTotalIncomeController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const totalIncome = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: "credit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return res.status(200).json({
      success: true,
      totalIncome: totalIncome[0]?.total || 0,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTotalExpenseController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const totalExpense = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), transactionType: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return res.status(200).json({
      success: true,
      totalExpense: totalExpense[0]?.total || 0,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

