import React from 'react';

const UserTable = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/users');
<<<<<<< HEAD
=======
            console.log(response)
>>>>>>> master
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
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
        fetchUsers();
    }, []);

    if (loading) return <div className="loading">Loading users...</div>;

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
                            <th>Signed Up</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => (
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
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
