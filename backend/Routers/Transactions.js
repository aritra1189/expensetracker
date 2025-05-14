import express from 'express';
import { addTransactionController, deleteTransactionController, getAllTransactionController, getTotalExpenseController, getTotalIncomeController, updateTransactionController } from '../controllers/transactionController.js';

const router = express.Router();

router.route("/addTransaction").post(addTransactionController);

router.route("/getTransaction").post(getAllTransactionController);


router.route("/deleteTransaction/:id").post(deleteTransactionController);

router.route('/updateTransaction/:id').put(updateTransactionController);
router.post("/total-income", getTotalIncomeController);
router.post("/total-expense", getTotalExpenseController);

export default router;