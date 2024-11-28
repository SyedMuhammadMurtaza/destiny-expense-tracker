import { useState } from 'react';
import { createExpense } from '../api/expensesApi';

const ExpenseForm = ({ projectId, onExpenseCreated }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [investment, setInvetment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = await createExpense({ projectId, description, amount, investment });
    onExpenseCreated(newExpense.data);
    setDescription('');
    setAmount('');
    setInvetment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input 
        type='text' 
        placeholder='Investment By' 
        value={investment} onChange={(e) => setInvetment(e.target.value)}
        required
        />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
