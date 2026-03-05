import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const CoachRequests = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvalLoading, setApprovalLoading] = useState(null); // ID of coach being approved
    const [selectedDoc, setSelectedDoc] = useState(null); // { url, type, title }

    const fetchCoaches = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/coaches`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Fetched Coaches Data:', data);
                // Filter to show only pending coaches
                const coachesArray = data.data || [];
                const pendingCoaches = coachesArray.filter(coach => !coach.is_approved);
                setCoaches(pendingCoaches);
            } else {
                console.error('Failed to fetch coaches:', data.message);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, []);

    const handleApprove = async (coachId) => {
        if (!window.confirm('Are you sure you want to approve this coach?')) return;

        setApprovalLoading(coachId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/approve-coach/${coachId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert('Coach Approved Successfully!');
                // Remove from list
                setCoaches(coaches.filter(c => c.id !== coachId));
            } else {
                alert('Failed to approve: ' + data.message);
            }
        } catch (error) {
            console.error('Error approving coach:', error);
            alert('Error approving coach');
        } finally {
            setApprovalLoading(null);
        }
    };

    // Helper to open doc
    const openDoc = (url, title) => {
        setSelectedDoc({ url, title });
    };

    if (loading) return <div className="loading">Loading coaches...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Registered Coaches</h2>
            </div>
            {coaches.length === 0 ? (
                <div className="empty-state">No coaches found</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Bank Details</th>
                                <th>Documents</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coaches.map((coach) => (
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
                                            <br />
                                            <small>{coach.ifsc_code}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="docs-links">
                                            {/* Debug: {JSON.stringify({ n: coach.nutrition_url, a: coach.aadhar_card_url })} */}
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
                                    <td>
                                        {coach.is_approved ? (
                                            <span className="badge-success">Approved</span>
                                        ) : (
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApprove(coach.id)}
                                                disabled={approvalLoading === coach.id}
                                            >
                                                {approvalLoading === coach.id ? 'Approving...' : 'Approve'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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

export default CoachRequests;
