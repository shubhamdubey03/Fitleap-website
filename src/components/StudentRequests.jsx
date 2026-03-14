import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const StudentRequests = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvalLoading, setApprovalLoading] = useState(null); // ID of student being approved
    const [selectedDoc, setSelectedDoc] = useState(null); // { url, title }

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/student-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Fetched Students Data:', data);
                // Filter to show only pending students
                const studentsArray = data.data || [];
                const pendingStudents = studentsArray.filter(student => !student.is_active);
                setStudents(pendingStudents);
            } else {
                console.error('Failed to fetch students:', data.message);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleApprove = async (studentId) => {
        if (!window.confirm('Are you sure you want to approve this student?')) return;

        setApprovalLoading(studentId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/approve-student/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert('Student Approved Successfully!');
                // Remove from list
                setStudents(students.filter(s => s.id !== studentId));
            } else {
                alert('Failed to approve: ' + data.message);
            }
        } catch (error) {
            console.error('Error approving student:', error);
            alert('Error approving student');
        } finally {
            setApprovalLoading(null);
        }
    };

    const handleReject = async (studentId) => {
        if (!window.confirm('Are you sure you want to reject this student request? This will delete the user.')) return;

        setApprovalLoading(studentId);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/admin/reject-student/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert('Student Request Rejected Successfully!');
                // Remove from list
                setStudents(students.filter(s => s.id !== studentId));
            } else {
                alert('Failed to reject: ' + data.message);
            }
        } catch (error) {
            console.error('Error rejecting student:', error);
            alert('Error rejecting student');
        } finally {
            setApprovalLoading(null);
        }
    };

    // Helper to open doc
    const openDoc = (url, title) => {
        setSelectedDoc({ url, title });
    };

    if (loading) return <div className="loading">Loading student requests...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Student Requests</h2>
            </div>
            {students.length === 0 ? (
                <div className="empty-state">No pending student requests found</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>ID Card</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar">{student.name?.charAt(0) || 'S'}</div>
                                            {student.name || 'Unknown'}
                                        </div>
                                    </td>
                                    <td>{student.email}</td>
                                    <td>{student.phone}</td>
                                    <td>
                                        {student.id_proof_image ? (
                                            <button className="doc-link btn-link" onClick={() => openDoc(student.id_proof_image, 'Student ID Card')}>
                                                📄 View ID Card
                                            </button>
                                        ) : (
                                            <span className="text-muted">No ID Uploaded</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="actions-cell" style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApprove(student.id)}
                                                disabled={approvalLoading === student.id}
                                            >
                                                {approvalLoading === student.id ? '...' : 'Approve'}
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleReject(student.id)}
                                                disabled={approvalLoading === student.id}
                                            >
                                                Reject
                                            </button>
                                        </div>
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
                            {selectedDoc.url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                <img src={selectedDoc.url} alt="ID Card Preview" className="doc-img" />
                            ) : (
                                <iframe
                                    src={selectedDoc.url}
                                    title="Document Preview"
                                    className="doc-frame"
                                    frameBorder="0"
                                />
                            )}
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

export default StudentRequests;
