import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const SubscriptionPlanTable = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [formData, setFormData] = useState({
        plan_name: '',
        price: '',
        duration_days: '',
        features: ''
    });

    const PLANS_API = `${API_URL}/v1/subscriptions/plans`;

    const fetchPlans = async () => {
        try {
            const response = await fetch(`${PLANS_API}/all`);
            const data = await response.json();
            if (response.ok) {
                setPlans(data.data || []);
            } else {
                console.error('Failed to fetch plans:', data.error);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        // Convert features string back to array
        const payload = {
            ...formData,
            features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
        };

        const url = isEditing ? `${PLANS_API}/${selectedPlanId}` : PLANS_API;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                alert(isEditing ? 'Plan updated successfully' : 'Plan added successfully');
                setShowModal(false);
                setFormData({ plan_name: '', price: '', duration_days: '', features: '' });
                setIsEditing(false);
                setSelectedPlanId(null);
                fetchPlans();
            } else {
                alert('Action failed: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving plan:', error);
        }
    };

    const handleEdit = (plan) => {
        setFormData({
            plan_name: plan.plan_name,
            price: plan.price,
            duration_days: plan.duration_days,
            features: Array.isArray(plan.features) ? plan.features.join(', ') : ''
        });
        setSelectedPlanId(plan.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${PLANS_API}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (response.ok) {
                alert('Plan deleted successfully');
                fetchPlans();
            } else {
                alert('Failed to delete plan: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
        }
    };

    if (loading) return <div className="loading">Loading plans...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Subscription Plans</h2>
                <button className="add-btn" onClick={() => {
                    setFormData({ plan_name: '', price: '', duration_days: '', features: '' });
                    setIsEditing(false);
                    setShowModal(true);
                }}>+ Add Plan</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Price (₹)</th>
                            <th>Duration (Days)</th>
                            <th>Features</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No plans found</td></tr>
                        ) : (
                            plans.map((plan) => (
                                <tr key={plan.id}>
                                    <td>{plan.plan_name}</td>
                                    <td>{plan.price}</td>
                                    <td>{plan.duration_days}</td>
                                    <td>
                                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {Array.isArray(plan.features) ? plan.features.join(', ') : ''}
                                        </div>
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(plan)} className="edit-btn" style={{ marginRight: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(plan.id)} className="delete-btn" style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
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
                        <h3>{isEditing ? 'Edit Plan' : 'Add New Plan'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Plan Name</label>
                                <input type="text" name="plan_name" value={formData.plan_name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Duration (Days)</label>
                                <input type="number" name="duration_days" value={formData.duration_days} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Features (comma separated)</label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleInputChange}
                                    placeholder="Feature 1, Feature 2, Feature 3"
                                    style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}>
                                    {isEditing ? 'Update Plan' : 'Add Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlanTable;
