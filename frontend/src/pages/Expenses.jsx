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
  const [investment, setInvestment] = useState('');
  const [expenseEntries, setExpenseEntries] = useState([]);

  const investmentOptions = ['Muneeb', 'Asad']; // Valid investment options

  // Fetch all clients from backend
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

    // Create new expense entry
    const newExpense = {
      description,
      amount,
      date,
      investment,
      clientId: selectedClientId,
      projectId: selectedProjectId,
      selectedClient: selectedClient,
      selectedProject: selectedProject,
    };

    

    // Send the new expense to the backend
    try {
      const response = await axios.post('https://destiny-expense-tracker.onrender.com/api/expenses',{
        description,
        amount,
        date,
        investment,
        clientId: selectedClientId,
        projectId: selectedProjectId,
        selectedClient: selectedClient,
        selectedProject: selectedProject
      });
      const savedExpense = response.data;

      // Update local state with the new expense
      setExpenseEntries([savedExpense, ...expenseEntries]);

      // Clear the form fields
      setDescription('');
      setInvestment('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('There was an error saving the expense.');
    }
  };

  // Handle deleting an expense from the database
  const handleDeleteExpense = async (expenseId) => {
    try {
      // Delete from backend
      await axios.delete(`https://destiny-expense-tracker.onrender.com/api/expenses/${expenseId}`);

      // Remove from local state
      setExpenseEntries(expenseEntries.filter(expense => expense._id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('There was an error deleting the expense.');
    }
  };

  

  // PDF download functionality
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

  // UseEffect hooks
  useEffect(() => {
    fetchClients(); // Fetch clients on component mount
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchProjects(selectedClientId); // Fetch projects based on selected client
    } else {
      setProjects([]);
    }
  }, [selectedClientId]);

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
              {filteredInvestments.map((option) => (
                <li
                  key={option}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setInvestment(option);
                    setFilteredInvestments([]);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit">Log Expense</Button>
      </form>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Date</th>
              <th className="p-2">Client</th>
              <th className="p-2">Project</th>
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Investment</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenseEntries.map((expense, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{new Date(expense.date).toLocaleDateString('en-GB')}</td>
                <td className="p-2">{expense.client}</td>
                <td className="p-2">{expense.project}</td>
                <td className="p-2">{expense.description}</td>
                <td className="p-2">Rs. {expense.amount.toLocaleString()}</td>
                <td className="p-2">{expense.investment}</td>
                <td className="p-2">
                  <Button onClick={() => handleDeleteExpense(expense._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={handleDownloadPDF} className="mt-6">Download Expenses PDF</Button>
    </div>
  );
};


export default Expenses;


