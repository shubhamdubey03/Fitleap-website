import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './ResetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const AUTH_API = `${API_URL}/auth`;

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setMessage({ type: 'error', text: 'Invalid reset link.' });
                setIsVerifying(false);
                return;
            }

            try {
                await axios.post(`${AUTH_API}/verify-reset-token`, { token });
                setIsVerifying(false);
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Token is invalid or has expired.'
                });
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${AUTH_API}/reset-password/${token}`, {
                newPassword,
                confirmPassword
            });
            setMessage({ type: 'success', text: response.data.message || 'Password reset successfully!' });
            setIsLoading(false);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to reset password.'
            });
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="reset-container">
                <div className="reset-card">
                    <div className="loader"></div>
                    <p>Verifying your link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-container">
            <div className="reset-card">
                <h2>Reset Password</h2>
                <p className="subtitle">Enter your new password below.</p>

                {message.text && (
                    <div className={`alert ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {message.type !== 'success' && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="reset-btn" disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <button className="back-btn" onClick={() => navigate('/')}>
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
