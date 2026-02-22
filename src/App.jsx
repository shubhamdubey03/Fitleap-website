<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> master
import './App.css';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import VendorTable from './components/VendorTable';
import ClientTable from './components/ClientTable';
import CoachRequests from './components/CoachRequests';
<<<<<<< HEAD

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

=======
import ProductTable from './components/ProductTable';

import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check auth state from localStorage on initial load
  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminToken');
  };

  // If not authenticated, show Login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

>>>>>>> master
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserTable />;
      case 'vendors':
        return <VendorTable />;
      case 'clients':
        return <ClientTable />;
      case 'coach_requests':
        return <CoachRequests />;
<<<<<<< HEAD
=======
      case 'products':
        return <ProductTable />;
>>>>>>> master
      default:
        return <UserTable />;
    }
  };

  return (
    <div className="app-container">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
<<<<<<< HEAD
          setActiveTab(tab);
          closeSidebar();
=======
          if (tab === 'logout') {
            handleLogout();
          } else {
            setActiveTab(tab);
            closeSidebar();
          }
>>>>>>> master
        }}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
