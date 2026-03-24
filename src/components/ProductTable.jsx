import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category: '',
        gst_percent: 0
    });


    const PRODUCT_API = `${API_URL}/orders/products`;

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(PRODUCT_API, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            } else {
                console.error('Failed to fetch products:', data.error);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${PRODUCT_API}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setProducts(products.filter(p => p.id !== id));
                alert('Product deleted successfully');
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url,
            category: product.category,
            gst_percent: product.gst_percent || 0
        });

        setEditingProductId(product.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);
        data.append('gst_percent', formData.gst_percent);


        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image_url) {
            data.append('image_url', formData.image_url);
        }

        try {
            const token = localStorage.getItem('adminToken');
            const url = isEditing ? `${PRODUCT_API}/${editingProductId}` : PRODUCT_API;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data,
            });

            const result = await response.json();
            if (response.ok) {
                alert(isEditing ? 'Product updated successfully' : 'Product added successfully');
                setShowModal(false);
                setIsEditing(false);
                setEditingProductId(null);
                setFormData({ name: '', description: '', price: '', stock: '', image_url: '', category: '', gst_percent: 0 });

                setImageFile(null);
                fetchProducts();
            } else {
                alert(`Failed to ${isEditing ? 'update' : 'add'} product: ` + result.error);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} product:`, error);
        }
    };

    if (loading) return <div className="loading">Loading products...</div>;

    const openAddModal = () => {
        setIsEditing(false);
        setEditingProductId(null);
        setFormData({ name: '', description: '', price: '', stock: '', image_url: '', category: '', gst_percent: 0 });

        setImageFile(null);
        setShowModal(true);
    };

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Marketplace Products</h2>
                <button className="add-btn" onClick={openAddModal}>+ Add Product</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>GST (%)</th>
                            <th>Stock</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No products found</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <img src={product.image_url || 'https://via.placeholder.com/50'} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.gst_percent || 0}%</td>
                                    <td>{product.stock}</td>

                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
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
                        <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>GST Percentage (%)</label>
                                <input type="number" name="gst_percent" value={formData.gst_percent} onChange={handleInputChange} required />
                            </div>


                            <div className="form-group">
                                <label>Product Image</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                                <div style={{ marginTop: 5, fontSize: 12, color: '#666' }}>Or provide URL (optional fallback)</div>
                                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." style={{ marginTop: 5 }} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ marginLeft: '10px' }}>{isEditing ? 'Update Product' : 'Add Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
