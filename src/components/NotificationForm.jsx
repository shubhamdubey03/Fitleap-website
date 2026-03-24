import React, { useState } from 'react';
import API_URL from '../config';

const NotificationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        body: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendBroadcast = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${API_URL}/notifications/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage({ text: 'Broadcast notification sent successfully!', type: 'success' });
                setFormData({ title: '', body: '' });
            } else {
                setMessage({ text: 'Error: ' + result.message, type: 'error' });
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            setMessage({ text: 'Server connection failed.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Send Notifications</h2>
            </div>

            <div className="form-container" style={{ maxWidth: '600px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSendBroadcast}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Notification Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g. New Feature Available!"
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: '#fff', color: '#333' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Notification Body</label>
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleInputChange}
                            placeholder="Write your message here..."
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', minHeight: '120px', backgroundColor: '#fff', color: '#333' }}
                        />
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
                            color: message.type === 'success' ? '#2e7d32' : '#c62828',
                            border: `1px solid ${message.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '14px 24px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            width: '100%'
                        }}
                    >
                        {loading ? 'Sending...' : '🚀 Send Broadcast Notification'}
                    </button>
                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
                        This will send a push notification to all users and save it in their history.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default NotificationForm;
