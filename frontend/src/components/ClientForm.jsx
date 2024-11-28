import { useState } from 'react';
import { createClient } from '../api/clientsApi';

const ClientForm = ({ onClientCreated }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newClient = await createClient({ name });
    onClientCreated(newClient.data);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Add Client</button>
    </form>
  );
};

export default ClientForm;
