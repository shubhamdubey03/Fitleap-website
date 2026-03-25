import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const WorkoutCategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });

    const CATEGORY_API = `${API_URL}/workout-categories`;

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(CATEGORY_API, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            image: category.image || ''
        });
        setCurrentCategoryId(category.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${CATEGORY_API}/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                alert('Category deleted successfully');
                fetchCategories();
            } else {
                alert('Failed to delete category: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const url = isEditing 
                ? `${CATEGORY_API}/update/${currentCategoryId}` 
                : `${CATEGORY_API}/create`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert(`Category ${isEditing ? 'updated' : 'added'} successfully`);
                setShowModal(false);
                setFormData({ name: '', image: '' });
                setIsEditing(false);
                setCurrentCategoryId(null);
                fetchCategories();
            } else {
                alert(`Failed to ${isEditing ? 'update' : 'add'} category: ` + result.error);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} category:`, error);
        }
    };

    if (loading) return <div className="loading">Loading categories...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Workout Categories</h2>
                <button className="add-btn" onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: '', image: '' });
                    setShowModal(true);
                }}>+ Add Category</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No categories found</td></tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <img src={category.image || 'https://via.placeholder.com/50'} alt={category.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                    </td>
                                    <td>{category.name}</td>
                                    <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="edit-btn-small" onClick={() => handleEdit(category)}>Edit</button>
                                            <button className="delete-btn-small" onClick={() => handleDelete(category.id)}>Delete</button>
                                        </div>
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
                        <h3>{isEditing ? 'Edit Category' : 'Add New Category'}</h3>
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
                                <button type="submit" className="submit-btn" style={{ marginLeft: '10px' }}>
                                    {isEditing ? 'Update Category' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutCategoryTable;
