import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvestmentSummary = () => {
  const [muneebInvestmentSummary, setMuneebInvestmentSummary] = useState([]);
  const [asadInvestmentSummary, setAsadInvestmentSummary] = useState([]);
  const [activeClientTab, setActiveClientTab] = useState(null); // Track active tab for client
  const [refreshKey, setRefreshKey] = useState(0); // Track the refresh key

  // Fetch investment summary for Muneeb
  const fetchMuneebInvestmentSummary = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/expenses/investment-summary/Muneeb');
      setMuneebInvestmentSummary(response.data);
    } catch (error) {
      console.error('Error fetching Muneeb investment summary:', error);
    }
  };

  // Fetch investment summary for Asad
  const fetchAsadInvestmentSummary = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/expenses/investment-summary/Asad');
      setAsadInvestmentSummary(response.data);
    } catch (error) {
      console.error('Error fetching Asad investment summary:', error);
    }
  };

  // Fetch data whenever refreshKey changes
  useEffect(() => {
    fetchMuneebInvestmentSummary();
    fetchAsadInvestmentSummary();
  }, [refreshKey]); // Refresh when refreshKey changes

  // Function to handle tab click for Client
  const handleClientTabClick = (clientId) => {
    setActiveClientTab(clientId);
  };

  // Group Muneeb's investment summary by clientId
  const groupedMuneebByClient = muneebInvestmentSummary.reduce((acc, summary) => {
    const clientId = summary.clientDetails._id;
    if (!acc[clientId]) {
      acc[clientId] = { clientName: summary.clientDetails.name, projects: [] };
    }
    acc[clientId].projects.push(summary);
  
    // Sort projects alphabetically by projectName
    acc[clientId].projects.sort((a, b) => a.projectName.localeCompare(b.projectName));
    return acc;
  }, {});

  // Group and sort Asad's investment summary by projectName
  const groupedAsadByClient = asadInvestmentSummary.reduce((acc, summary) => {
    const clientId = summary.clientDetails._id;
    if (!acc[clientId]) {
      acc[clientId] = { clientName: summary.clientDetails.name, projects: [] };
    }
    acc[clientId].projects.push(summary);
  
    // Sort projects alphabetically by projectName
    acc[clientId].projects.sort((a, b) => a.projectName.localeCompare(b.projectName));
    return acc;
  }, {});

  // Get the union of client IDs from both Muneeb and Asad summaries
  const clientIds = [...new Set([...Object.keys(groupedMuneebByClient), ...Object.keys(groupedAsadByClient)])];

  // Function to trigger refresh
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to refetch data
  };

  return (
    <div className="p-6 mt-12">
      <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>

      {/* Refresh Button */}
      <button 
        onClick={handleRefresh}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Refetch Data
      </button>

      {/* Client Tabs */}
      <div className="mb-4">
        {clientIds.map((clientId) => {
          const clientName = groupedMuneebByClient[clientId]?.clientName || groupedAsadByClient[clientId]?.clientName;
          return (
            <button
              key={clientId}
              onClick={() => handleClientTabClick(clientId)}
              className={`mr-4 py-2 px-4 ${activeClientTab === clientId ? 'bg-blue-600 text-white rounded-md hover:bg-blue-700' : 'bg-gray-200 rounded-md'}`}
            >
              {clientName}
            </button>
          );
        })}
      </div>

      {/* Displaying Investment Summary for Selected Client */}
      {activeClientTab && (
        <div>
          <h4 className="text-lg font-semibold mb-4 mt-10">Grand Total Investment For {groupedMuneebByClient[activeClientTab]?.clientName}</h4>
          <div className='flex space-x-28 w-full mt-14'>
            {/* Muneeb's Table */}
            {groupedMuneebByClient[activeClientTab] && (
              <div className="mb-6">
                <h5 className="text-lg font-semibold mb-2">Investment Summary by Muneeb</h5>
                <table className="w-[40vw] border-collapse border border-gray-700 mb-4">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border px-4 py-2">Project Name</th>
                      <th className="border px-4 py-2">Total Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMuneebByClient[activeClientTab].projects.map((summary) => (
                      <tr key={summary._id}>
                        <td className="border px-4 py-2">{summary.projectName}</td>
                        <td className="border px-4 py-2">Rs.{summary.totalExpense.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Muneeb's Grand Total */}
                <p className="text-lg font-semibold mt-2">
                  Grand Total (Muneeb): Rs.
                  {groupedMuneebByClient[activeClientTab].projects
                    .reduce((acc, summary) => acc + summary.totalExpense, 0)
                    .toLocaleString()}
                </p>
              </div>
            )}

            {/* Asad's Table */}
            {groupedAsadByClient[activeClientTab] && (
              <div className="mb-6">
                <h5 className="text-lg font-semibold mb-2">Investment Summary by Asad</h5>
                <table className="w-[40vw] border-collapse border border-gray-700 mb-4">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border px-4 py-2">Project Name</th>
                      <th className="border px-4 py-2">Total Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedAsadByClient[activeClientTab].projects.map((summary) => (
                      <tr key={summary._id}>
                        <td className="border px-4 py-2">{summary.projectName}</td>
                        <td className="border px-4 py-2">Rs.{summary.totalExpense.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Asad's Grand Total */}
                <p className="text-lg font-semibold mt-2">
                  Grand Total (Asad): Rs.
                  {groupedAsadByClient[activeClientTab].projects
                    .reduce((acc, summary) => acc + summary.totalExpense, 0)
                    .toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentSummary;
