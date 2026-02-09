import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import VendorTable from './components/VendorTable';
import ClientTable from './components/ClientTable';
import CoachRequests from './components/CoachRequests';

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

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
          setActiveTab(tab);
          closeSidebar();
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
