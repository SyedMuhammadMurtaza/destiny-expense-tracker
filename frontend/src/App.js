// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Clients from './pages/Clients';
// import Projects from './pages/Projects';
// import Expenses from './pages/Expenses';
// import InvByProject from './pages/InvByProject';
// import InvByName from './pages/InvByName';

// const App = () => {
//   return (
//     <Router>
//       <div className="flex relative">
//         <Sidebar /> {/* Sidebar component */}
//         {/* Main Content */}
//         <div className="transition-all w-full p-6 ">
//           <Routes>
//             <Route path="/" element={<Clients />} />
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/expenses" element={<Expenses />} />
//             <Route path="/ledger/inv-by-project" element={<InvByProject />} />
//             <Route path="/ledger/inv-by-name" element={<InvByName />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Clients from './pages/Clients';
// import Projects from './pages/Projects';
// import Expenses from './pages/Expenses';
// import InvByProject from './pages/InvByProject';
// import InvByName from './pages/InvByName';

// const App = () => {
//   return (
//     <Router>
//       <div className="flex relative">
//         <Sidebar /> {/* Sidebar component */}
//         {/* Main Content */}
//         <div className="transition-all w-full p-6 ">
//           <Routes>
//             <Route path="/" element={<Clients />} />
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/expenses" element={<Expenses />} />
//             <Route path="/ledger/inv-by-project" element={<InvByProject />} />
//             <Route path="/ledger/inv-by-name" element={<InvByName />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };


// export default App;


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Expenses from './pages/Expenses';
import InvByProject from './pages/InvByProject';
import InvByName from './pages/InvByName';
import Login from './components/Login'; // Assuming you have this file

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true'); // Check localStorage for login status

  const handleLogin = (success) => {
    if (success) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Save login status
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false'); // Save login status
  };

  return (
    <Router>
      <div className="flex relative">
        {isLoggedIn ? <Sidebar /> : null} {/* Show sidebar only when logged in */}
        <div className="transition-all w-full">
          <Routes>
            {/* Protect routes: If not logged in, redirect to login page */}
            <Route
              path="/"
              element={isLoggedIn ? <Clients /> : <Navigate to="/login" />}
            />
            <Route
              path="/projects"
              element={isLoggedIn ? <Projects /> : <Navigate to="/login" />}
            />
            <Route
              path="/expenses"
              element={isLoggedIn ? <Expenses /> : <Navigate to="/login" />}
            />
            <Route
              path="/ledger/inv-by-project"
              element={isLoggedIn ? <InvByProject /> : <Navigate to="/login" />}
            />
            <Route
              path="/ledger/inv-by-name"
              element={isLoggedIn ? <InvByName /> : <Navigate to="/login" />}
            />
            {/* Login route */}
            <Route
              path="/login"
              element={<Login onLogin={handleLogin} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

