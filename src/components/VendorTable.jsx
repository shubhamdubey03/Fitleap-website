import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const VendorTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        address: '',
        city: '',
        pincode: '',
        address_type: 'business',
        state_id: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchVendors = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/vendors/vendors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            console.log("hhhhhhhhnnnnnnnnnnnnhh", data);
            if (res.ok) {
                setVendors(data);
            } else {
                console.error("Failed to load vendors:", data.error);
            }
        } catch (err) {
            console.error("Error fetching vendors:", err);
        }
    };

    const fetchStates = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/states`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            console.log("hhhhhhhhhh", data);
            if (res.ok) {
                setStatesList(data);
            } else {
                console.error("Failed to load states:", data);
            }
        } catch (err) {
            console.error("Error fetching states:", err);
        }
    };

    useEffect(() => {
        fetchVendors();
        fetchStates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.phone)) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }

        // Pincode validation (numbers only)
        const pincodeRegex = /^[0-9]+$/;
        if (!pincodeRegex.test(formData.pincode)) {
            alert("Pincode must contain only numbers");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                mobile: formData.phone.trim(),
                country_code: "+91",
                category: formData.category,
                address1: formData.address.trim(),
                city: formData.city.trim(),
                pincode: formData.pincode.trim(),
                address_type: formData.address_type,
                state_id: formData.state_id
            };

            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/vendors/create-vendor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            console.log('response', data, response)

            if (response.ok) {
                alert(`Vendor created!\nTemporary Password: ${data.login_password}\n(Also sent via Email)`);
                setIsModalOpen(false);
                setFormData({
                    name: '', email: '', phone: '', category: '', address: '',
                    city: '', pincode: '', address_type: 'business', state_id: ''
                });
                fetchVendors(); // Refresh the dynamic list
            } else {
                alert(`Error: ${data.error || data.message || 'Failed to create vendor'}`);
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to connect to the server.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Vendor Directory</h2>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Vendor</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Category</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="avatar">{vendor.name?.charAt(0) || 'V'}</div>
                                        {vendor.name}
                                    </div>
                                </td>
                                <td><span className="badge">{vendor.category}</span></td>
                                <td>{vendor.email}</td>
                                <td>{vendor.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Vendor</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Vendor Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter vendor name"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="vendor@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} required>
                                        <option value="">Select Category</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Nutrition">Nutrition</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Technology">Technology</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street Address"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        placeholder="Pincode"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Address Type</label>
                                    <select name="address_type" value={formData.address_type} onChange={handleChange} required>
                                        <option value="home">Home</option>
                                        <option value="business">Business</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <select name="state_id" value={formData.state_id} onChange={handleChange} required>
                                        <option value="">Select State</option>
                                        {statesList.map(state => (
                                            <option key={state.id} value={state.id}>{state.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorTable;
