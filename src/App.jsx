import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import VendorTable from './components/VendorTable';
import ClientTable from './components/ClientTable';
import CoachRequests from './components/CoachRequests';
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
      case 'products':
        return <ProductTable />;
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
          if (tab === 'logout') {
            handleLogout();
          } else {
            setActiveTab(tab);
            closeSidebar();
          }
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
