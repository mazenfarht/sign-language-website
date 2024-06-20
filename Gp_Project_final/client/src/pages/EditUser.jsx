import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Alert, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EditUser = () => {
    const { user, updateUser, logoutUser } = useContext(AuthContext);
    const [editInfo, setEditInfo] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEditInfo({ name: user.name, email: user.email, password: '' });
        }
    }, [user]);

    const handleChange = (e) => {
        setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, editInfo, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            setSuccess('Profile updated successfully!');
            const updatedUser = { ...user, name: editInfo.name, email: editInfo.email };
            updateUser(updatedUser); // Update user context
            setEditInfo({ ...editInfo, password: '' });
        } catch (error) {
            setError(error.response?.data || 'Failed to update profile');
        }

        setIsLoading(false);
    };

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <Stack gap={3} className="edit-user-form">
            <h2>Edit Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={editInfo.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={editInfo.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={editInfo.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </Button>
            </Form>
            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
        </Stack>
    );
};

export default EditUser;
