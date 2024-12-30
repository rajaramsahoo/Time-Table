import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';
const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmpassword: ''
    });

    const [error, setError] = useState('');

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        // Password comparison
        if (formData.password !== formData.confirmpassword) {
            setError('Passwords do not match ');
            return;
        }

        // Send data to the backend
        try {
            const response = await axios.post('https://time-table-backend-6pp1.onrender.com/api/v1/signup', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirmpassword: formData.confirmpassword
            });
            console.log('Registration successful:', response);
            // Redirect or show success message
        } catch (error) {
            console.error('Error during registration:', error);
            setError('An error occurred during registration.');
        }
    };

    return (
        <div className="container">
            <h5 className="text-center my-3">Create Account</h5>
            <Form onSubmit={handleRegister}>
                {error && <p className="text-danger text-center">{error}</p>}

                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        className="form-control-sm"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        className="form-control-sm"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicNumber">
                    <Form.Control
                        type="text"
                        placeholder="Enter your phone number"
                        className="form-control-sm"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        className="form-control-sm"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        className="form-control-sm"
                        name="confirmpassword"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-sm">
                    Register
                </Button>

                <p className="text-center mt-3">
                    Have an account?{" "}

                    <Link to="/login" className="text-primary">
                        Login here
                    </Link>
                </p>
            </Form>
        </div>
    );
};

export default SignUp;
