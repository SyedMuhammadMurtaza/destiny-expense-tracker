import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Expenses = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [investment, setInvestment] = useState('');
  const [expenseEntries, setExpenseEntries] = useState([]);

  const investmentOptions = ['Muneeb', 'Asad']; // Valid investment options

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
    if (!clientId) return;
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

  // Handle client search
  const handleClientSearch = (searchValue) => {
    setSelectedClient(searchValue); // Update input value
    if (searchValue.trim()) {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  };

  // Handle project search
  const handleProjectSearch = (searchValue) => {
    setSelectedProject(searchValue); // Update input value
    if (searchValue.trim()) {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects([]);
    }
  };

  // Handle investment search
  const handleInvestmentSearch = (searchValue) => {
    setInvestment(searchValue); // Update input value
    if (searchValue.trim()) {
      const filtered = investmentOptions.filter((option) =>
        option.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredInvestments(filtered);
    } else {
      setFilteredInvestments([]);
    }
  };

  // Handle expense submission
  const handleLogExpense = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (
      !description.trim() ||
      !amount ||
      !selectedClientId ||
      !selectedProjectId ||
      !date ||
      !investment.trim()
    ) {
      alert('Please fill in all fields.');
      return;
    }

    // Validate investment
    if (!investmentOptions.includes(investment)) {
      alert('Please select a valid investment option.');
      return;
    }

    // Add expense entry to the list
    const newExpense = {
      description,
      amount,
      date,
      investment,
      clientId: selectedClientId,
      projectId: selectedProjectId,
      client: selectedClient,
      project: selectedProject,
    };

    setExpenseEntries([...expenseEntries, newExpense]);

    try {
      await axios.post('https://destiny-expense-tracker.onrender.com/api/expenses', {
        description,
        amount,
        date,
        investment,
        clientId: selectedClientId,
        projectId: selectedProjectId,
      });
      setDescription('');
      setInvestment('');
      setAmount('');
      setDate('');
      fetchExpenses(selectedProjectId); // Refresh expense list
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
      setExpenseEntries(expenseEntries.filter((expense) => expense._id !== expenseId)); // Remove from local expense entries state
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchProjects(selectedClientId);
    } else {
      setProjects([]);
    }
  }, [selectedClientId]);

  // Handle downloading expenses as a PDF
  const handleDownloadPDF = () => {
    if (expenseEntries.length === 0) {
      alert("No expenses available to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text('Expenses Report', 14, 15);

    const tableData = expenseEntries.map((expense) => [
      new Date(expense.date).toLocaleDateString('en-GB'),
      expense.client,
      expense.project,
      expense.description,
      `Rs. ${expense.amount.toLocaleString()}`,
      expense.investment,
    ]);

    const tableColumns = ['Date', 'Client', 'Project', 'Description', 'Amount', 'Investment By'];

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 30,
    });

    doc.save('expenses-report.pdf');
  };

  return (
    <div className="p-6 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Expenses</h1>

      {/* Log Expense Form */}
      <form onSubmit={handleLogExpense} className="w-[270%] flex justify-between gap-4 sm:w-auto mb-6 mt-12">
        {/* Autocomplete for Clients */}
        <div className="relative w-44">
          <Input
            type="text"
            value={selectedClient}
            onChange={(e) => handleClientSearch(e.target.value)}
            placeholder="Enter Client"
            required
          />
          {filteredClients.length > 0 && selectedClient.trim() && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto w-full">
              {filteredClients.map((client) => (
                <li
                  key={client._id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedClient(client.name);
                    setSelectedClientId(client._id);
                    setFilteredClients([]);
                  }}
                >
                  {client.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Autocomplete for Projects */}
        <div className="relative w-44">
          <Input
            type="text"
            value={selectedProject}
            onChange={(e) => handleProjectSearch(e.target.value)}
            placeholder="Enter Project"
            required
          />
          {filteredProjects.length > 0 && selectedProject.trim() && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto w-full">
              {filteredProjects.map((project) => (
                <li
                  key={project._id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedProject(project.name);
                    setSelectedProjectId(project._id);
                    setFilteredProjects([]);
                  }}
                >
                  {project.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative w-44">
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expense Description"
            required
          />
        </div>

        <div className="relative w-44">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
        </div>

        <div className="relative w-44">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Investment By - Searchable Dropdown */}
        <div className="relative w-44">
          <Input
            type="text"
            value={investment}
            onChange={(e) => handleInvestmentSearch(e.target.value)}
            placeholder="Investment By"
            required
          />
          {filteredInvestments.length > 0 && investment.trim() && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto w-full">
              {filteredInvestments.map((investmentOption) => (
                <li
                  key={investmentOption}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setInvestment(investmentOption);
                    setFilteredInvestments([]);
                  }}
                >
                  {investmentOption}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit">Log Expense</Button>
      </form>

      {/* Display Expenses */}
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Project</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Investment By</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenseEntries.map((expense) => (
            <tr key={expense._id}>
              <td className="border p-2">{new Date(expense.date).toLocaleDateString('en-GB')}</td>
              <td className="border p-2">{expense.client}</td>
              <td className="border p-2">{expense.project}</td>
              <td className="border p-2">{expense.description}</td>
              <td className="border p-2">Rs. {expense.amount.toLocaleString()}</td>
              <td className="border p-2">{expense.investment}</td>
              <td className="border p-2">
                <button  onClick={() => handleDeleteExpense(expense._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className='mt-12' onClick={handleDownloadPDF}>Download Expenses PDF</Button>
    </div>
  );
};

export default Expenses;
