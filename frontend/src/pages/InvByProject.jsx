import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvByProject = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [investmentFilter, setInvestmentFilter] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('clients'); // 'clients', 'projects', or 'expenses'
  
  const calculateTotal = (expensesList) =>
    expensesList.reduce((total, expense) => total + expense.amount, 0);

  const [totalExpenses, setTotalExpenses] = useState(0); // For all expenses
  const [filteredTotal, setFilteredTotal] = useState(0); // For filtered expenses

  // Function to fetch all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Function to fetch projects for a specific client
  const fetchProjects = async (clientId) => {
    try {
      const response = await axios.get(`https://destiny-expense-tracker.onrender.com/api/projects/${clientId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Function to fetch expenses for a specific project
  const fetchExpenses = async (projectId) => {
    try {
      const response = await axios.get(`https://destiny-expense-tracker.onrender.com/api/expenses/${projectId}`);
      setExpenses(response.data);
      setFilteredExpenses(response.data);
      setTotalExpenses(calculateTotal(response.data));
      setFilteredTotal(calculateTotal(response.data));
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Refetch data (Clients, Projects, and Expenses)
  const refreshData = () => {
    if (selectedClient) {
      fetchProjects(selectedClient);
    }
    if (selectedProject) {
      fetchExpenses(selectedProject);
    }
  };

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Handle client tab click
  const handleClientClick = (clientId) => {
    setSelectedClient(clientId);
    fetchProjects(clientId);
    setView('projects');
  };

  // Handle project tab click
  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    fetchExpenses(projectId);
    setView('expenses');
  };

  // Handle back navigation
  const handleBack = () => {
    if (view === 'expenses') {
      setView('projects');
      setSelectedProject(null);
      setExpenses([]);
      setFilteredExpenses([]);
      setInvestmentFilter('');
    } else if (view === 'projects') {
      setView('clients');
      setSelectedClient(null);
      setProjects([]);
    }
  };

  // Handle filtering by investment
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setInvestmentFilter(filterValue);

    if (filterValue === '') {
      // Reset filter
      setFilteredExpenses(expenses);
      setFilteredTotal(calculateTotal(expenses));
    } else {
      // Filter expenses based on investment field
      const filtered = expenses.filter((expense) =>
        expense.investment.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredExpenses(filtered);
      setFilteredTotal(calculateTotal(filtered));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(`https://destiny-expense-tracker.onrender.com/api/expenses/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense.');
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedProject) {
      alert("No project selected for generating PDF.");
      return;
    }

    const project = projects.find((proj) => proj._id === selectedProject);
    const projectName = project ? project.name : "Unknown Project";

    if (expenses.length === 0) {
      alert("No expenses available to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Expenses Report for Project: ${projectName}`, 14, 15);

    const tableData = expenses.map((expense) => [
      new Date(expense.date).toLocaleDateString('en-GB'),
      expense.description,
      `Rs. ${expense.amount.toLocaleString()}`,
      expense.investment,
    ]);

    const tableColumns = ['Date', 'Description', 'Amount', 'Investment By'];

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
      startY: 30,
    });

    doc.save(`${projectName}-expenses-report.pdf`);
  };

  return (
    <div className="p-6 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Investments by Project</h1>

      {/* Clients View */}
      {view === 'clients' && (
        <div className="flex flex-wrap gap-2">
          {clients.map((client) => (
            <button
              key={client._id}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => handleClientClick(client._id)}
            >
              {client.name}
            </button>
          ))}
        </div>
      )}

      {/* Projects View */}
      {view === 'projects' && (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={handleBack}
          >
            Back to Clients
          </button>
          <div className="flex flex-wrap gap-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <button
                  key={project._id}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => handleProjectClick(project._id)}
                >
                  {project.name}
                </button>
              ))
            ) : (
              <p>No projects found for the selected client.</p>
            )}
          </div>
        </div>
      )}

      {/* Expenses View */}
      {view === 'expenses' && (
        <div>
          <button
            className="mb-4 mr-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={handleBack}
          >
            Back to Projects
          </button>
          <Button onClick={refreshData}>Refetch Data</Button> {/* Manual refresh button */}

          {/* Filter Dropdown */}
          <div className="mb-4">
            <label htmlFor="investmentFilter" className="block text-gray-700 font-medium">
              Filter by Investment:
            </label>
            <select
              id="investmentFilter"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={investmentFilter}
              onChange={handleFilterChange}
            >
              <option value="">Show All</option>
              {[...new Set(expenses.map((expense) => expense.investment))].map((investment) => (
                <option key={investment} value={investment}>
                  {investment}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 text-gray-700 font-medium">
            <p>Total Expenses: Rs.{totalExpenses.toLocaleString()}</p>
            <p>
              Total for Filtered Expenses: {investmentFilter ? `Rs. ${filteredTotal}` : 'N/A'}
            </p>
          </div>

          {/* Expenses Table */}
          {filteredExpenses.length > 0 ? (
            <table className="w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-700 px-4 py-2">Description</th>
                  <th className="border border-gray-700 px-4 py-2">Amount</th>
                  <th className="border border-gray-700 px-4 py-2">Date</th>
                  <th className="border border-gray-700 px-4 py-2">Investment By</th>
                  <th className="border border-gray-700 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="text-center">
                    <td className="border border-gray-700 px-4 py-2">{expense.description}</td>
                    <td className="border border-gray-700 px-4 py-2">
                      Rs.{expense.amount.toLocaleString()}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {new Date(expense.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">{expense.investment}</td>
                    <td className="border border-gray-700 px-4 py-2">
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
          ) : (
            <p className="text-red-600">No expenses found for the selected project.</p>
          )}
        </div>
      )}

      <div className="mt-10">
        <Button variant="secondary" onClick={handleDownloadPDF}>Download as PDF</Button>
      </div>
    </div>
  );
};

export default InvByProject;
