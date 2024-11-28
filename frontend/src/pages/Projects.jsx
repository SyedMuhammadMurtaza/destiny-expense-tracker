// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Option from '../components/ui/Option';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const response = await axios.get('https://destiny-expense-tracker.onrender.com/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Handle creating new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !selectedClient) return;

    try {
      await axios.post('https://destiny-expense-tracker.onrender.com/api/projects', {
        name: newProjectName,
        clientId: selectedClient,
      });
      setNewProjectName('');
      setSelectedClient('');
      fetchProjects(); // Reload projects list after creation
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  return (
    <div className=" p-6">
      <h1 className="text-2xl font-semibold mb-6">Projects</h1>

      {/* Create Project Form */}
      <form onSubmit={handleCreateProject} className="mb-6 space-y-4">

      <Select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          required
        >
          <Option value="">Select Client</Option>
          {clients.map((client) => (
            <Option key={client._id} value={client._id}>
              {client.name}
            </Option>
          ))}
        </Select>
        
        <Input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
       
        <Button type="submit" variant="primary">
          Create Project
        </Button>
      </form>

      {/* Projects List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Project List</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project._id} className="p-4 bg-gray-700 rounded-md text-white">
                {project.name} 
                {/* (Client ID: {project.clientId}) */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Projects;
