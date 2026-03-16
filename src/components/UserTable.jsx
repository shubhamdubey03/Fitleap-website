import React from 'react';
import API_URL from '../config';

const UserTable = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const limit = 10;

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/auth/users?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("................**88", response)
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users || []);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.page || 1);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUsers(1);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchUsers(newPage);
        }
    };

    if (loading && users.length === 0) return <div className="loading">Loading users...</div>;

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Users Management</h2>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Products</th>
                            <th>Signed Up</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                // Extract product names from orders
                                const productNames = user.orders
                                    ?.map(order => order.products?.name)
                                    .filter(name => !!name)
                                    .join(', ') || 'None';

                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar">{user.name?.charAt(0) || 'U'}</div>
                                                {user.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                        <td><span className={`badge ${user.role}`}>{(user.role || 'user').toUpperCase()}</span></td>
                                        <td>
                                            <div style={{ fontSize: '0.85em', color: '#ccc', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={productNames}>
                                                {productNames}
                                            </div>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
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
        </div>
    );
};

export default UserTable;
