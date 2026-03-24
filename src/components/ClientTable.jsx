import React, { useState } from 'react';
import API_URL from '../config';

const ClientTable = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 10;
    const [selectedDoc, setSelectedDoc] = useState(null); // Document Viewer State

    const fetchApprovedCoaches = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const url = `${API_URL}/admin/coaches?page=${page}&limit=${limit}&is_approved=true${search ? `&search=${encodeURIComponent(search)}` : ''}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCoaches(data.data || []);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.page || 1);
            } else {
                console.error('Failed to fetch coaches:', data.message);
            }
        } catch (error) {
            console.error('Error fetching coaches:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    React.useEffect(() => {
        fetchApprovedCoaches(1, searchTerm);
    }, []);

    // Debounced search
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== undefined) {
                fetchApprovedCoaches(1, searchTerm);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchApprovedCoaches(newPage, searchTerm);
        }
    };

    const openDoc = (url, title) => {
        setSelectedDoc({ url, title });
    };

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Approved Coaches</h2>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search coaches..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-overlay" style={{ textAlign: 'center', padding: '50px' }}>Loading coaches...</div>
                ) : (
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
                )}
            </div>

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

export default ClientTable;
