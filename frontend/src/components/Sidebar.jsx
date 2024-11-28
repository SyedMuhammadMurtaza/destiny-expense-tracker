import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Ref for the sidebar to check for clicks outside
  const sidebarRef = useRef(null);

  // Toggle the sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close the sidebar when any component inside is clicked
  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  // Handle outside click
  const handleClickOutside = (e) => {
    // Close the sidebar if click is outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Add event listener for outside click
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const linkClasses = ({ isActive }) =>
    `block w-full text-left py-2 px-4 rounded-md ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`transition-all fixed top-0 left-0 z-20 h-screen bg-gray-800 text-white ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)', // Sidebar goes off-screen when collapsed
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className={`mt-12 text-2xl font-semibold transition-all ${isSidebarOpen ? 'block' : 'hidden'}`}>
            Expense Tracker
          </h2>
        </div>
        {/* Sidebar Links */}
        <nav className="flex-grow">
          <NavLink to="/" className={linkClasses} onClick={handleLinkClick}>
            Clients
          </NavLink>
          <NavLink to="/projects" className={linkClasses} onClick={handleLinkClick}>
            Projects
          </NavLink>
          <NavLink to="/expenses" className={linkClasses} onClick={handleLinkClick}>
            Expenses
          </NavLink>
          {/* <NavLink to="/ledger" className={linkClasses} onClick={handleLinkClick}>
            Ledger
          </NavLink> */}
             {/* Ledger Menu */}
             <hr className='mt-8'/>
        <div>
          <h3 className="px-4 py-2 mt-8 text-gray-400">Ledger</h3>
          <NavLink to="/ledger/inv-by-project" className={linkClasses} onClick={handleLinkClick}>
            Inv by Project
          </NavLink>
          <NavLink to="/ledger/inv-by-name" className={linkClasses} onClick={handleLinkClick}>
            Inv by Name
          </NavLink>
        </div>
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-4 left-4 z-30 text-white bg-gray-800 p-2 rounded-full"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? '' : '→'} {/* Show an arrow or icon */}
      </button>
    </>
  );
};

export default Sidebar;
