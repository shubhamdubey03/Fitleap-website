import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/orders/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                console.error('Failed to fetch orders:', data.error);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateDeliveryStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/orders/${orderId}/delivery-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ delivery_status: newStatus })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Delivery status updated');
                fetchOrders();
            } else {
                alert(`Error: ${data.message || data.error}`);
            }
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Orders Management</h2>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Details</th>
                            <th>Address</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Total Price</th>
                            <th>Payment</th>
                            <th>Delivery Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>No orders found</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id.slice(0, 8)}</td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{order.users?.name || 'N/A'}</div>
                                        <div style={{ fontSize: '0.85em', color: '#aaa' }}>{order.users?.email}</div>
                                        <div style={{ fontSize: '0.85em', color: '#aaa' }}>{order.users?.phone || 'No Phone'}</div>
                                    </td>
                                    <td>
                                        {order.addresses ? (
                                            <div style={{ fontSize: '0.85em', maxWidth: '180px' }}>
                                                {order.addresses.address1}, {order.addresses.city} - {order.addresses.pincode}
                                                {order.addresses.mobile_number && <div style={{ color: '#aaa' }}>Mob: {order.addresses.mobile_number}</div>}
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td>{order.products?.name}</td>
                                    <td>{order.quantity}</td>
                                    <td>₹{order.total_price}</td>
                                    <td>
                                        <span className={`badge ${order.status === 'paid' || order.payments?.status === 'success' ? 'paid' : 'unpaid'}`}>
                                            {order.status === 'paid' || order.payments?.status === 'success' ? 'PAID' : 'UNPAID'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={order.delivery_status || 'pending'}
                                            onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
                                            className={`status-select-inline badge ${order.delivery_status || 'pending'}`}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="confirmed">CONFIRMED</option>
                                            <option value="packed">PACKED</option>
                                            <option value="shipped">SHIPPED</option>
                                            <option value="out_for_delivery">OUT FOR DELIVERY</option>
                                            <option value="delivered">DELIVERED</option>
                                            <option value="cancelled">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;
