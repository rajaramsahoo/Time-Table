import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeTableData, setTimeTableData] = useState({
    whichClass: '',
    noOfDays: '',
    noOfPeriod: '',
    classStartTime: '',
    durationOfEachClass: '',
    breakAfterWhichPeriod: ['', '', ''],
    breakDuration: ['', '', ''],
  });

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful:', response.data.token);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      setIsLoggedIn(false);
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Invalid credentials'}`);
      } else if (error.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error('Error during login:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedOption(value); // Set selectedOption for class
    setTimeTableData({
      ...timeTableData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        'http://localhost:3001/api/v2/createtimetable',
        {
          ...timeTableData,
          breakAfterWhichPeriod: timeTableData.breakAfterWhichPeriod.split(','),
          breakDuration: timeTableData.breakDuration.split(','),
        },
        { headers }
      );

      if (response.status === 201) {
        alert('TimeTable created successfully!');
        navigate('/timetable');
      }
    } catch (error) {
      console.error('Error creating timetable:', error);
      alert(error.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <>
      {!localStorage.getItem('user') ? (
        <div className="container">
          <h5 className="text-center my-3">Log In</h5>
          <Form onSubmit={handleLogin}>
            {error && <p className="text-danger text-center">{error}</p>}
            {loading && <p className="text-center">Logging in...</p>}

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="form-control-sm"
                name="email"
                value={formData.email}
                onChange={handleChangeLogin}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                className="form-control-sm"
                name="password"
                value={formData.password}
                onChange={handleChangeLogin}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-sm" disabled={loading}>
              Submit
            </Button>
            <p className="text-center mt-3">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary">
                Register Here
              </a>
            </p>
          </Form>
        </div>
      ) : (
        <>
          <div className="container">
            <h5 className="text-center my-3">Manage Time Table</h5>
            <Form>
              <Form.Label style={{ fontWeight: 'bold' }}>Select class</Form.Label>
              <Form.Select size="sm" className="mb-3" value={selectedOption} onChange={handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Form.Select>
              <Button type="submit" className="btn-sm" onClick={handleSubmit} style={{ backgroundColor: '#43BE31' }}>
                Manage
              </Button>
            </Form>
          </div>

          <div className="container">
            <h5 className="text-center my-3">Create Time Table</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicNumber">
                <Form.Control
                  type="number"
                  placeholder="Enter class"
                  className="form-control-sm"
                  name="whichClass"
                  value={timeTableData.whichClass}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Dynamic break input fields */}
              {selectedOption && (
                <>
                  {[...Array(Number(selectedOption))].map((_, index) => (
                    <div key={index}>
                      <Form.Group className="mb-3" controlId={`breakAfterWhichPeriod${index}`}>
                        <Form.Label style={{ fontSize: '14px' }}>
                          Break {index + 1}: After period
                        </Form.Label>
                        <Form.Control
                          type="number"
                          className="form-control-sm"
                          name="breakAfterWhichPeriod"
                          value={timeTableData.breakAfterWhichPeriod[index]}
                          onChange={(e) => {
                            const newBreakAfterWhichPeriod = [...timeTableData.breakAfterWhichPeriod];
                            newBreakAfterWhichPeriod[index] = e.target.value;
                            setTimeTableData({ ...timeTableData, breakAfterWhichPeriod: newBreakAfterWhichPeriod });
                          }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId={`breakDuration${index}`}>
                        <Form.Label style={{ fontSize: '14px' }}>Duration of Break {index + 1} (in minutes)</Form.Label>
                        <Form.Control
                          type="number"
                          className="form-control-sm"
                          name="breakDuration"
                          value={timeTableData.breakDuration[index]}
                          onChange={(e) => {
                            const newBreakDuration = [...timeTableData.breakDuration];
                            newBreakDuration[index] = e.target.value;
                            setTimeTableData({ ...timeTableData, breakDuration: newBreakDuration });
                          }}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </>
              )}

              <Button variant="primary" type="submit" className="btn-sm">
                Submit
              </Button>
            </Form>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
