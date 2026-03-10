import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const PCTable = () => {
    const [pcs, setPcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'program',
        duration_days: '',
        reward_coins: '',
        is_free: true
    });

    const PC_API = `${API_URL}/pc`;

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(PC_API, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data && response.data.programs) {
                // The API returns { programs: [...] }
                setPcs(response.data.programs);
            }
        } catch (error) {
            console.error('Error fetching programs/challenges:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this program/challenge?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(`${PC_API}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200 || response.status === 204) {
                setPcs(pcs.filter(item => item.id !== id));
                alert('Deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post(`${PC_API}/create`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("ssssss", response)
            if (response.status === 200 || response.status === 201) {
                alert('Program/Challenge added successfully');
                setShowModal(false);
                setFormData({
                    title: '',
                    description: '',
                    type: 'program',
                    duration_days: '',
                    reward_coins: '',
                    is_free: true
                });
                fetchData();
            }
        } catch (error) {
            console.error('Error adding:', error);
            alert('Failed to add: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Programs & Challenges</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Duration (Days)</th>
                            <th>Reward Coins</th>
                            <th>Access</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pcs.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No programs or challenges found</td></tr>
                        ) : (
                            pcs.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                                    <td>{item.duration_days}</td>
                                    <td>{item.reward_coins}</td>
                                    <td>
                                        <span className={`status-badge ${item.is_free ? 'active' : 'inactive'}`} style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            backgroundColor: item.is_free ? '#e8f5e9' : '#fff3e0',
                                            color: item.is_free ? '#2e7d32' : '#ef6c00'
                                        }}>
                                            {item.is_free ? 'Free' : 'Subscription'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Program / Challenge</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', minHeight: '80px', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}
                                />
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange} required>
                                        <option value="program">Program</option>
                                        <option value="challenge">Challenge</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Duration (Days)</label>
                                    <input type="number" name="duration_days" value={formData.duration_days} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Reward Coins</label>
                                    <input type="number" name="reward_coins" value={formData.reward_coins} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                                    <input
                                        type="checkbox"
                                        id="is_free"
                                        name="is_free"
                                        checked={formData.is_free}
                                        onChange={handleInputChange}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <label htmlFor="is_free" style={{ margin: 0 }}>Is Free?</label>
                                </div>
                            </div>
                            <div className="modal-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ backgroundColor: '#4834d4', color: 'white', marginLeft: '10px' }}>Add Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PCTable;
