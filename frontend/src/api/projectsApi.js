import axios from 'axios';



const API_URL = 'https://destiny-expense-tracker.onrender.com/api/projects';

export const fetchProjects = (clientId) => axios.get(`${API_URL}/client/${clientId}`);
export const createProject = (projectData) => axios.post(API_URL, projectData);
