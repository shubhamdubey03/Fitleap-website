import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const CoachRequests = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [approvalLoading, setApprovalLoading] = useState(null); // ID of coach being approved
    const [selectedDoc, setSelectedDoc] = useState(null); // { url, type, title }

    const fetchCoaches = async (page = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/coaches?page=${page}&limit=${limit}&is_approved=false`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Fetched Coaches Data:', data);
                setCoaches(data.data || []);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.page || 1);
                // If current page is empty and not page 1, go to previous page
                if ((data.data || []).length === 0 && data.page > 1) {
                    fetchCoaches(data.page - 1);
                }
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
        fetchCoaches(1);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchCoaches(newPage);
        }
    };

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
                // Re-fetch to update list and pagination
                fetchCoaches(currentPage);
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

    const handleReject = async (coachId) => {
        if (!window.confirm('Are you sure you want to reject this coach request? This will delete the user.')) return;

        setApprovalLoading(coachId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/reject-coach/${coachId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert('Coach Request Rejected Successfully!');
                // Re-fetch to update list and pagination
                fetchCoaches(currentPage);
            } else {
                alert('Failed to reject: ' + data.message);
            }
        } catch (error) {
            console.error('Error rejecting coach:', error);
            alert('Error rejecting coach');
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
                <h2>Pending Coach Requests</h2>
            </div>
            {coaches.length === 0 ? (
                <div className="empty-state">No pending coach requests found</div>
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
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleApprove(coach.id)}
                                                    disabled={approvalLoading === coach.id}
                                                >
                                                    {approvalLoading === coach.id ? '...' : 'Approve'}
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleReject(coach.id)}
                                                    disabled={approvalLoading === coach.id}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
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
