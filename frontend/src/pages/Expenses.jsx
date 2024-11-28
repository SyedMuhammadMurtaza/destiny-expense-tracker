import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Option from '../components/ui/Option';

const Expenses = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [investment, setInvestment] = useState('');

  const investmentOptions = ['Muneeb', 'Asad']; // Predefined investment names


  // Fetch all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Fetch projects based on selected client
  const fetchProjects = async (clientId) => {
    if (!clientId) {
      setProjects([]);
      return;
    }
    try {
      const response = await axios.get(`https://destiny-expense-tracker.onrender.com/api/projects/${clientId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch expenses based on selected project
  const fetchExpenses = async (projectId) => {
    if (!projectId) {
      setExpenses([]);
      return;
    }
    try {
      const response = await axios.get(`https://destiny-expense-tracker.onrender.com/api/expenses/${projectId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Handle client selection change
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    setSelectedProject(''); // Reset selected project
    fetchProjects(clientId);
    setExpenses([]); // Reset expenses
  };

  // Handle project selection change
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    fetchExpenses(projectId);
  };

  // Handle expense submission
  const handleLogExpense = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || !selectedClient || !selectedProject || !date || !investment) return;

    try {
      await axios.post('https://destiny-expense-tracker.onrender.com/api/expenses', {
        description,
        amount,
        date,
        investment,
        clientId: selectedClient,
        projectId: selectedProject,
      });
      setDescription('');
      setInvestment('');
      setAmount('');
      setDate('');
      fetchExpenses(selectedProject); // Refresh expense list
      alert('Expense logged successfully!');
    } catch (error) {
      console.error('Error logging expense:', error);
      alert('Failed to log expense.');
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`https://destiny-expense-tracker.onrender.com/api/expenses/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense._id !== expenseId)); // Remove deleted expense from the state
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Expenses</h1>

      {/* Log Expense Form */}
      <form onSubmit={handleLogExpense} className="mb-6 space-y-4">
        <Select value={selectedClient} onChange={handleClientChange} required>
          <Option value="">Select Client</Option>
          {clients.map((client) => (
            <Option key={client._id} value={client._id}>
              {client.name}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedProject}
          onChange={handleProjectChange}
          required
          disabled={!selectedClient}
        >
          <Option value="">Select Project</Option>
          {projects.map((project) => (
            <Option key={project._id} value={project._id}>
              {project.name}
            </Option>
          ))}
        </Select>

        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Expense Description"
          required
        />

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Replaced Investment input field with a dropdown */}
        <Select
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          required
        >
          <Option value="">Select Investment By</Option>
          {investmentOptions.map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select> 

        <Button type="submit" variant="primary">
          Log Expense
        </Button>
      </form>

      {/* Expenses List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Expense List</h2>
        {expenses.length === 0 ? (
          <p>No expenses found for this project.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className='bg-gray-800 text-white'>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Investment By</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="border px-4 py-2">{expense.description}</td>
                  <td className="border px-4 py-2">Rs.{expense.amount.toLocaleString()}</td>
                  <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{expense.investment}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Expenses;
