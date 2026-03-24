import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const WorkoutTable = () => {
    const [workouts, setWorkouts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        coin: '',
        time: '',
        category_id: ''
    });

    const WORKOUT_API = `${API_URL}/workouts`;
    const CATEGORY_API = `${API_URL}/workout-categories`;

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const [workoutRes, categoryRes] = await Promise.all([
                fetch(WORKOUT_API, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(CATEGORY_API, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const workoutData = await workoutRes.json();
            const categoryData = await categoryRes.json();

            if (workoutRes.ok) setWorkouts(workoutData.data || []);
            if (categoryRes.ok) setCategories(categoryData.data || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this workout?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${WORKOUT_API}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setWorkouts(workouts.filter(w => w.id !== id));
                alert('Workout deleted successfully');
            } else {
                alert('Failed to delete workout');
            }
        } catch (error) {
            console.error('Error deleting workout:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(WORKOUT_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Workout added successfully');
                setShowModal(false);
                setFormData({ name: '', coin: '', time: '', category_id: '' });
                fetchData();
            } else {
                alert('Failed to add workout: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding workout:', error);
        }
    };

    if (loading) return <div className="loading">Loading workouts...</div>;

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Unknown';
    };

    return (
        <div className="content-section">
            <div className="section-header">
                <h2>Workouts</h2>
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Workout</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Coins</th>
                            <th>Time (mins)</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No workouts found</td></tr>
                        ) : (
                            workouts.map((workout) => (
                                <tr key={workout.id}>
                                    <td>{workout.name}</td>
                                    <td>{workout.coin}</td>
                                    <td>{workout.time}</td>
                                    <td>{getCategoryName(workout.id)}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(workout.id)}>Delete</button>
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
                        <h3>Add New Workout</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Workout Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Coins</label>
                                <input type="number" name="coin" value={formData.coin} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Time (Minutes)</label>
                                <input type="number" name="time" value={formData.time} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" style={{ marginLeft: '10px' }}>Add Workout</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutTable;
