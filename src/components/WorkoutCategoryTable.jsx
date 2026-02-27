import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const WorkoutCategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });

    const CATEGORY_API = `${API_URL}/workout-categories`;

    const fetchCategories = async () => {
        try {
            const response = await fetch(CATEGORY_API);
            const data = await response.json();
            if (response.ok) {
                setCategories(data.data || []);
            } else {
                console.error('Failed to fetch categories:', data.error);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${CATEGORY_API}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Category added successfully');
                setShowModal(false);
                setFormData({ name: '', image: '' });
                fetchCategories();
            } else {
                alert('Failed to add category: ' + result.error);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    if (loading) return <div className="loading">Loading categories...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Workout Categories</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Category</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr><td colSpan="3" style={{ textAlign: 'center' }}>No categories found</td></tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <img src={category.image || 'https://via.placeholder.com/50'} alt={category.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                    </td>
                                    <td>{category.name}</td>
                                    <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Category</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}>Add Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutCategoryTable;
