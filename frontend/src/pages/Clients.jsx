// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState('');

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Handle creating new client
  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!newClient.trim()) return;


    try {
      await axios.post('https://destiny-expense-tracker.onrender.com/api/clients', { name: newClient });
      setNewClient('');
      fetchClients(); // Reload clients list after creation
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  useEffect(() => {
    fetchClients(); // Fetch clients on page load
  }, []);

  return (
    <div className=" p-6">
      <h1 className="text-2xl font-semibold mb-6">Clients</h1>

      {/* Create Client Form */}
      <form onSubmit={handleCreateClient} className="mb-6 flex space-x-2">
        <Input
          value={newClient}
          onChange={(e) => setNewClient(e.target.value)}
          placeholder="Enter client name"
          required
        />
        <Button type="submit" variant="primary">
          Create Client
        </Button>
      </form>

      {/* Clients List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Client List</h2>
        {clients.length === 0 ? (
          <p>No clients found.</p>
        ) : (
          <ul className="space-y-2">
            {clients.map((client) => (
              <li key={client._id} className="p-4 bg-gray-700 rounded-md text-white	">
                {client.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Clients;
