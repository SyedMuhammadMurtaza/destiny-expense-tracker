import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Expenses from './pages/Expenses';
import InvByProject from './pages/InvByProject';
import InvByName from './pages/InvByName';

const App = () => {
  return (
    <Router>
      <div className="flex relative">
        <Sidebar /> {/* Sidebar component */}
        {/* Main Content */}
        <div className="transition-all w-full p-6 ">
          <Routes>
            <Route path="/" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/ledger/inv-by-project" element={<InvByProject />} />
            <Route path="/ledger/inv-by-name" element={<InvByName />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
