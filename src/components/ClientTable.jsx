
import React, { useState } from 'react';

const ClientTable = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState(null); // Document Viewer State

    const fetchApprovedCoaches = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/coaches');
            const data = await response.json();
            console.log('Approved Coaches Fetch Response:', data); // Debug Log
            if (response.ok) {
                setCoaches(data);
            } else {
                console.error('Failed to fetch coaches:', data.message);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchApprovedCoaches();
    }, []);

    const openDoc = (url, title) => {
        setSelectedDoc({ url, title });
    };

    if (loading) return <div className="loading">Loading coaches...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Approved Coaches</h2>
                <div className="actions">
                    <input type="text" placeholder="Search coaches..." className="search-input" />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Bank Details</th>
                            <th>Documents</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coaches.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No approved coaches found.</td>
                            </tr>
                        ) : (
                            coaches.map((coach) => (
                                <tr key={coach.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar">{coach.users?.name?.charAt(0) || 'C'}</div>
                                            {coach.users?.name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td>{coach.users?.email}</td>
                                    <td>{coach.users?.phone}</td>
                                    <td>
                                        <div className="detail-cell">
                                            <strong>{coach.bank_name}</strong>
                                            <br />
                                            <small>{coach.bank_acc_no}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="docs-links">
                                            {(!coach.nutrition_url && !coach.aadhar_card_url && !coach.pan_card_url) && (
                                                <span className="text-muted">No Documents</span>
                                            )}
                                            {coach.nutrition_url && (
                                                <button className="doc-link btn-link" onClick={() => openDoc(coach.nutrition_url, 'Certification')}>
                                                    📄 Cert
                                                </button>
                                            )}
                                            {coach.aadhar_card_url && (
                                                <button className="doc-link btn-link" onClick={() => openDoc(coach.aadhar_card_url, 'Aadhaar')}>
                                                    🆔 Aadhaar
                                                </button>
                                            )}
                                            {coach.pan_card_url && (
                                                <button className="doc-link btn-link" onClick={() => openDoc(coach.pan_card_url, 'PAN')}>
                                                    💳 PAN
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td><span className="badge trainer">Active</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Document Viewer Modal */}
            {selectedDoc && (
                <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
                    <div className="modal-content doc-viewer-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedDoc.title}</h3>
                            <button className="close-btn" onClick={() => setSelectedDoc(null)}>×</button>
                        </div>
                        <div className="doc-preview-container">
                            <iframe
                                src={selectedDoc.url}
                                title="Document Preview"
                                className="doc-frame"
                                frameBorder="0"
                            />
                        </div>
                        <div className="modal-footer">
                            <a href={selectedDoc.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">Open in New Tab</a>
                            <button className="btn-primary" onClick={() => setSelectedDoc(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientTable;
