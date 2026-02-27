import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const menuItems = [
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'vendors', label: 'Vendors', icon: '🏪' },
        { id: 'clients', label: 'Coach', icon: '💼' },
        { id: 'coach_requests', label: 'Requests', icon: '🔔' },
        { id: 'products', label: 'Products', icon: '🛍️' },
        { id: 'workouts', label: 'Workouts', icon: '🏋️‍♂️' },
        { id: 'workout_categories', label: 'Workout Categories', icon: '📁' },
        { id: 'orders', label: 'Orders', icon: '📦' },
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-sidebar-btn" onClick={onClose}>×</button>
                <div className="sidebar-header">
                    <div className="logo-icon">FL</div>
                    <h2>FitLeap Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item logout" onClick={() => setActiveTab('logout')}>
                        <span className="icon">🚪</span>
                        <span className="label">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
