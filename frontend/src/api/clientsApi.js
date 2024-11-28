import axios from 'axios';


const API_URL = 'https://destiny-expense-tracker.onrender.com/api/clients';

export const fetchClients = () => axios.get(API_URL);
export const createClient = (clientData) => axios.post(API_URL, clientData);
