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
  const [enteredExpenses, setEnteredExpenses] = useState([]);

  const [currentPage, setCurrentPage] = useState(1); // Page number state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page
  const [editingExpense, setEditingExpense] = useState(null);


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
      client: selectedClient,
      project: selectedProject,
    };

    

    // Send the new expense to the backend
    try {
      const response = await axios.post('https://destiny-expense-tracker.onrender.com/api/expenses',newExpense);
      const savedExpense = response.data;

      // Update local state with the new expense
      setExpenseEntries([savedExpense, ...expenseEntries]);

      // Clear the form fields
      setSelectedClient('');
      setSelectedProject('');
      setDescription('');
      setInvestment('');
      setAmount('');
      setDate('');
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('There was an error saving the expense.');
    }
  };

  const handleAddExpense = async (newExpense) => {
    try {
      const response = await fetch("https://destiny-expense-tracker.onrender.com/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
  
      if (response.ok) {
        const createdExpense = await response.json();
        setEnteredExpenses((prevExpenses) => [...prevExpenses, createdExpense]);
        alert("Expense added successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to add expense: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("An error occurred while trying to add the expense.");
    }
  };
  

  // Handle deleting an expense from the database
  // const handleDeleteExpense = async (expenseId) => {
  //   try {
  //     // Delete from backend
  //     await axios.delete(`https://destiny-expense-tracker.onrender.com/api/expenses/${expenseId}`);

  //     // Remove from local state
  //     setExpenseEntries(expenseEntries.filter(expense => expense._id !== expenseId));
  //   } catch (error) {
  //     console.error('Error deleting expense:', error);
  //     alert('There was an error deleting the expense.');
  //   }
  // };

  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://destiny-expense-tracker.onrender.com/api/expenses/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setEnteredExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense._id !== id)
        );
        alert("Expense deleted successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete expense: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("An error occurred while trying to delete the expense.");
    }
  };

  
  
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount);
    setDate(new Date(expense.date).toISOString().split('T')[0]); // Set date in YYYY-MM-DD format
    setInvestment(expense.investment);
    setSelectedClient(expense.selectedClient);
    setSelectedClientId(expense.selectedClientId);
    setSelectedProject(expense.selectedProject);
    setSelectedProjectId(expense.selectedProjectId);
  };
  

  const handleSaveEdit = async (e) => {
    e.preventDefault();
  
    if (!editingExpense) return;
  
    const updatedExpense = {
      ...editingExpense,
      description,
      amount,
      date,
      investment,
      client:selectedClient,
      project:selectedProject,
      clientId: selectedClientId,
      projectId: selectedProjectId,
    };
  
    try {
      const response = await axios.put(
        `https://destiny-expense-tracker.onrender.com/api/expenses/${editingExpense._id}`,
        updatedExpense
      );
  
      if (response.status === 200) {
        // Update local state
        setExpenseEntries((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense._id === editingExpense._id ? updatedExpense : expense
          )
        );
  
        alert('Expense updated successfully.');
        setEditingExpense(null); // Clear editing state
         // Clear the form fields
      setSelectedClient('');
      setSelectedProject('');
      setDescription('');
      setInvestment('');
      setAmount('');
      setDate('');
      } else {
        alert('Failed to update expense.');
      }
      
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('An error occurred while updating the expense.');
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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("https://destiny-expense-tracker.onrender.com/api/expenses");
        if (response.ok) {
          const data = await response.json();
          setEnteredExpenses(data); // Set fetched expenses to the state
        } else {
          console.error("Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
  
    fetchExpenses();
  }, []);


  const sortedExpenses = [...enteredExpenses].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
  );

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
      const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage); 
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
  
    // Calculate the starting and ending index for expenses on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedExpenses = sortedExpenses.slice(startIndex, endIndex);

  

  return (
    <div className="p-6 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Expenses</h1>

      {/* Log Expense Form */}
      <form onSubmit={editingExpense ? handleSaveEdit : handleLogExpense} className="w-[270%] flex justify-between gap-4 sm:w-auto mb-6 mt-12">
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

        <Button type="submit" >Log Expense  {editingExpense ? 'Save Changes' : 'Log Expense'}</Button>
        {editingExpense && (
    <Button
      type="button"
      onClick={() => {
        setEditingExpense(null);
        setDescription('');
        setAmount('');
        setDate('');
        setInvestment('');
        setSelectedClient('');
        setSelectedProject('');
      }}
    >
      Cancel
    </Button>
  )}
      </form>

      {/* Expenses Table */}
      <div className="overflow-x-auto w-[260%] md:w-full">
        <table className="min-w-full table-auto ">
          <thead>
            <tr className="text-left bg-gray-100 ">
            <th className="p-2">Serial No</th> 
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
  {paginatedExpenses.map((expense, index) => (
    <tr key={expense._id}  className={
      expense.investment.toLowerCase() === "asad"
        ? "bg-yellow-500 text-white" // Add a background color for rows where investment is "asad"
        : ""
    }>
                      <td className="border border-gray-300 p-2">{startIndex + index + 1}</td> {/* Add serial number */}
      <td className="border border-gray-300 p-2">{new Date(expense.date).toLocaleDateString('en-GB')}</td>
      <td className="border border-gray-300 p-2">{expense.client}</td>
      <td className="border border-gray-300 p-2">{expense.project}</td>
      <td className="border border-gray-300 p-2">{expense.description}</td>
      <td className="border border-gray-300 p-2">{expense.amount.toLocaleString()}</td>
      <td className="border border-gray-300 p-2">{expense.investment}</td>
      <td className="border border-gray-300 p-2">
        <button
          onClick={() => handleDeleteExpense(expense._id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
        <button
        className="text-blue-500 hover:underline ml-5"
        onClick={() => handleEditExpense(expense)}
      >
        Edit
      </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

         {/* Pagination controls */}
         <div className="flex justify-between mt-4">
          <button
            className={`p-2 hover:bg-gray-200 disabled:opacity-50 ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <p>Page {currentPage} of {Math.ceil(sortedExpenses.length / itemsPerPage)}</p>
          <button
            className={`p-2 hover:bg-gray-200 disabled:opacity-50 ${currentPage === Math.ceil(sortedExpenses.length / itemsPerPage) ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>

      <Button onClick={handleDownloadPDF} className="mt-6">Download Expenses PDF</Button>
    </div>
  );
};

export default Expenses;


