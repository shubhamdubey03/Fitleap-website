import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const FreeDietForm = () => {
    const [formData, setFormData] = useState({
        food_name: '',
        food_type: 'breakfast',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [freeDiets, setFreeDiets] = useState([]);
    const [listLoading, setListLoading] = useState(true);

    const token = localStorage.getItem('adminToken');

    const foodTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];

    const fetchFreeDiets = async () => {
        setListLoading(true);
        try {
            const res = await fetch(`${API_URL}/diet/free`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) setFreeDiets(result.data || []);
        } catch (err) {
            console.error('Error fetching free diets:', err);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        fetchFreeDiets();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.food_name.trim()) {
            setMessage({ text: 'Food name is required.', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch(`${API_URL}/diet/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: null,          // null = global, visible to ALL users
                    // coach_id: null,
                    food_name: formData.food_name,
                    food_type: formData.food_type,
                    is_free: true
                }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setMessage({ text: '✅ Free diet added! All users can now see it.', type: 'success' });
                setFormData({ food_name: '', food_type: 'Breakfast' });
                fetchFreeDiets();
            } else {
                setMessage({ text: 'Error: ' + (result.message || result.error), type: 'error' });
            }
        } catch (error) {
            console.error('Error adding free diet:', error);
            setMessage({ text: 'Server connection failed.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Free Diet Plans</h2>
                <p style={{ color: '#666', marginTop: 4, fontSize: 14 }}>
                    Add diet plans that are visible to <strong>all users</strong> — no subscription required.
                </p>
            </div>

            {/* Add Form */}
            <div style={{ maxWidth: 600, backgroundColor: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', marginBottom: 40 }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                            Food Name *
                        </label>
                        <input
                            type="text"
                            name="food_name"
                            value={formData.food_name}
                            onChange={handleInputChange}
                            placeholder="e.g. Grilled Chicken Salad"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}>
                            Food Type
                        </label>
                        <select
                            name="food_type"
                            value={formData.food_type}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 8,
                                border: '1px solid #ddd',
                                fontSize: 15,
                                backgroundColor: '#ffffff',
                                color: '#333333',
                                appearance: 'auto',
                                WebkitAppearance: 'auto',
                                MozAppearance: 'auto',
                                boxSizing: 'border-box',
                                cursor: 'pointer'
                            }}
                        >
                            {foodTypes.map(t => (
                                <option key={t} value={t} style={{ color: '#333', backgroundColor: '#fff' }}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ padding: '12px 16px', backgroundColor: '#e8f5e9', borderRadius: 8, marginBottom: 20, border: '1px solid #a5d6a7' }}>
                        <span style={{ fontSize: 13, color: '#2e7d32' }}>
                            🌐 This diet will be marked as <strong>FREE</strong> and will appear for <strong>all users</strong>, including those without a subscription.
                        </span>
                    </div>

                    {message.text && (
                        <div style={{
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20,
                            backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                            color: message.type === 'success' ? '#2e7d32' : '#c62828',
                            border: `1px solid ${message.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: '#2ECC71',
                            color: 'white',
                            border: 'none',
                            padding: '14px 24px',
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            width: '100%'
                        }}
                    >
                        {loading ? 'Adding...' : '🥗 Add Free Diet Plan'}
                    </button>
                </form>
            </div>

            {/* Existing Free Diets List */}
            <div className="section-header" style={{ marginBottom: 16 }}>
                <h3 style={{ color: '#333' }}>All Global Free Diets</h3>
            </div>

            {listLoading ? (
                <p style={{ color: '#666' }}>Loading...</p>
            ) : freeDiets.length === 0 ? (
                <div style={{ padding: 30, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 12, color: '#999' }}>
                    No global free diets added yet.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={thStyle}>#</th>
                                <th style={thStyle}>Food Name</th>
                                <th style={thStyle}>Meal Type</th>
                                <th style={thStyle}>Added On</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {freeDiets.map((diet, i) => (
                                <tr key={diet.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={tdStyle}>{i + 1}</td>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{diet.food_name}</td>
                                    <td style={tdStyle}>{diet.food_type}</td>
                                    <td style={tdStyle}>{new Date(diet.created_at).toLocaleDateString()}</td>
                                    <td style={tdStyle}>
                                        <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                                            FREE
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const thStyle = {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 700,
    color: '#555',
    borderBottom: '2px solid #eee'
};

const tdStyle = {
    padding: '13px 16px',
    fontSize: 14,
    color: '#333'
};

export default FreeDietForm;
