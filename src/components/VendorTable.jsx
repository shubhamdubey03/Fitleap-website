import React from 'react';

const VendorTable = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        address: ''
    });

    const vendors = [
        { id: 1, name: 'FitEquip Co.', category: 'Equipment', rating: 4.8, revenue: '$15,000' },
        { id: 2, name: 'HealthySnacks Inc.', category: 'Nutrition', rating: 4.5, revenue: '$8,200' },
        { id: 3, name: 'GymWear Ltd.', category: 'Apparel', rating: 4.2, revenue: '$12,400' },
        { id: 4, name: 'TechFitness', category: 'Technology', rating: 4.9, revenue: '$22,000' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Add Vendor logic to be implemented\n' + JSON.stringify(formData, null, 2));
        setIsModalOpen(false);
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

            <div className="grid-container">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="card vendor-card">
                        <div className="card-header">
                            <h3>{vendor.name}</h3>
                            <span className="badge">{vendor.category}</span>
                        </div>
                        <div className="card-body">
                            <p>Rating: ⭐ {vendor.rating}</p>
                            <p>Monthly Revenue: <strong>{vendor.revenue}</strong></p>
                        </div>
                        <div className="card-footer">
                            <button className="btn-secondary">View Profile</button>
                            <button className="btn-outline">Report</button>
                        </div>
                    </div>
                ))}
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
                                        placeholder="City, Country"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Vendor</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorTable;
