import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const PCSubscriptionPlanTable = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [formData, setFormData] = useState({
        plan_name: '',
        description: '',
        days: '',
        price: '',
        is_active: true
    });

    const PC_PLANS_API = `${API_URL}/pc/plan`;

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${PC_PLANS_API}/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data && response.data.plans) {
                setPlans(response.data.plans);
            }
        } catch (error) {
            console.error('Error fetching PC plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');

        const url = isEditing
            ? `${PC_PLANS_API}/update/${selectedPlanId}`
            : `${PC_PLANS_API}/create`;

        if (formData.price < 0 || formData.days < 0) {
            alert('Price and Duration cannot be negative');
            return;
        }

        const method = isEditing ? 'put' : 'post';

        try {
            const response = await axios({
                method: method,
                url: url,
                data: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 201) {
                alert(isEditing ? 'Plan updated successfully' : 'Plan created successfully');
                setShowModal(false);
                setFormData({ plan_name: '', description: '', days: '', price: '', is_active: true });
                setIsEditing(false);
                setSelectedPlanId(null);
                fetchPlans();
            }
        } catch (error) {
            console.error('Error saving PC plan:', error);
            alert('Error: ' + (error.response?.data?.error || 'Failed to save plan'));
        }
    };

    const handleEdit = (plan) => {
        setFormData({
            plan_name: plan.plan_name,
            description: plan.description || '',
            days: plan.days,
            price: plan.price,
            is_active: plan.is_active
        });
        setSelectedPlanId(plan.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`${PC_PLANS_API}/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Plan deleted successfully');
            fetchPlans();
        } catch (error) {
            console.error('Error deleting PC plan:', error);
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="loading">Loading PC plans...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Program & Challenge Subscription Plans</h2>
                <button className="add-btn" onClick={() => {
                    setFormData({ plan_name: '', description: '', days: '', price: '', is_active: true });
                    setIsEditing(false);
                    setShowModal(true);
                }}>+ Add New Plan</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Description</th>
                            <th>Duration (Days)</th>
                            <th>Price (₹)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No plans found</td></tr>
                        ) : (
                            plans.map((plan) => (
                                <tr key={plan.id}>
                                    <td>{plan.plan_name}</td>
                                    <td>{plan.description}</td>
                                    <td>{plan.days}</td>
                                    <td>{plan.price}</td>
                                    <td>
                                        <span className={`status-badge ${plan.is_active ? 'active' : 'inactive'}`}>
                                            {plan.is_active ? 'Active' : 'Inactive'}
                                        </span>
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
                        <h3>{isEditing ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Plan Name</label>
                                <input type="text" name="plan_name" value={formData.plan_name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    style={{ width: '100%', minHeight: '80px', border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}
                                />
                            </div>
                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Duration (Days)</label>
                                    <input type="number" name="days" value={formData.days} onChange={handleInputChange} min="0" required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" required />
                                </div>
                            </div>
                            {isEditing && (
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <label htmlFor="is_active" style={{ margin: 0 }}>Is Active</label>
                                </div>
                            )}
                            <div className="modal-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}>
                                    {isEditing ? 'Update Plan' : 'Create Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PCSubscriptionPlanTable;
