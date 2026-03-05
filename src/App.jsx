import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import VendorTable from './components/VendorTable';
import ClientTable from './components/ClientTable';
import CoachRequests from './components/CoachRequests';
import ProductTable from './components/ProductTable';
import WorkoutTable from './components/WorkoutTable';
import WorkoutCategoryTable from './components/WorkoutCategoryTable';
import OrderTable from './components/OrderTable';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import SubscriptionPlanTable from './components/SubscriptionPlanTable';
import NotificationForm from './components/NotificationForm';
import StudentRequests from './components/StudentRequests';



function Dashboard({ handleLogout }) {
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
      case 'student_requests':
        return <StudentRequests />;
      case 'products':
        return <ProductTable />;
      case 'workouts':
        return <WorkoutTable />;
      case 'workout_categories':
        return <WorkoutCategoryTable />;
      case 'orders':
        return <OrderTable />;
      case 'subscription_plans':
        return <SubscriptionPlanTable />;
      case 'notifications':
        return <NotificationForm />;


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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAdminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminToken');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Dashboard handleLogout={handleLogout} />
            )
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
