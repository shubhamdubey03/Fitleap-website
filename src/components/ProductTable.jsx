import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category: ''
    });

    const PRODUCT_API = `${API_URL}/orders/products`;

    const fetchProducts = async () => {
        try {
            const response = await fetch(PRODUCT_API);
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
            const response = await fetch(`${PRODUCT_API}/${id}`, {
                method: 'DELETE',
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

        if (imageFile) {
            data.append('image', imageFile);
        } else if (formData.image_url) {
            data.append('image_url', formData.image_url);
        }

        try {
            const response = await fetch(PRODUCT_API, {
                method: 'POST',
                // Content-Type header must be undefined for FormData
                body: data,
            });
            const result = await response.json();
            if (response.ok) {
                alert('Product added successfully');
                setShowModal(false);
                setFormData({ name: '', description: '', price: '', stock: '', image_url: '', category: '' });
                setImageFile(null);
                fetchProducts();
            } else {
                alert('Failed to add product: ' + result.error);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Marketplace Products</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Product</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
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
                                    <td>{product.stock}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(product.id)} style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
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
                        <h3>Add New Product</h3>
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
                                <label>Product Image</label>
                                <input type="file" onChange={handleFileChange} accept="image/*" />
                                <div style={{ marginTop: 5, fontSize: 12, color: '#666' }}>Or provide URL (optional fallback)</div>
                                <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." style={{ marginTop: 5 }} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ backgroundColor: '#4CAF50', color: 'white', marginLeft: '10px' }}>Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
