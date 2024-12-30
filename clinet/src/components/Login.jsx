import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));



  // rajaram2@gmail.com
  const handleManage = async (event, classNumber) => {
    try {
      event.preventDefault();
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`https://time-table-backend-6pp1.onrender.com/api/v2/timetables/${user._id}?whichClass=${classNumber}`);
      alert(response.data.message)
      console.log(response.data.allTimeTables[0].classStartTime)
      localStorage.setItem("timeTableData", JSON.stringify(response.data.allTimeTables[0]));
      navigate('/timetable')

    } catch (error) {
      console.error("Error fetching timetable:", error);
    }

  };

  // handleManage(2)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Manage loading state


  // Handle form field changes
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://time-table-backend-6pp1.onrender.com/api/v1/login', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful:', response.data.token);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      setIsLoggedIn(false)
      setIsLoggedIn(false);

    } catch (error) {
      // Handle login error
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
  const [timeTableData, settimeTablemData] = useState({
    whichClass: "",
    noOfDays: "",
    noOfPeriod: "",
    classStartTime: "",
    durationOfEachClass: "",
    breakAfterWhichPeriod: '',
    breakDuration: "",
  });
  const handleSelectChange = (e) => {
    console.log(selectedOption)

    setSelectedOption(e.target.value);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    console.log(selectedOption)
    settimeTablemData({
      ...timeTableData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        "https://time-table-backend-6pp1.onrender.com/api/v2/createtimetable",
        {
          ...timeTableData,
          breakAfterWhichPeriod: typeof timeTableData.breakAfterWhichPeriod === "string" ? timeTableData.breakAfterWhichPeriod.split(",") : [],
          breakDuration: typeof timeTableData.breakDuration === "string" ? timeTableData.breakDuration.split(",") : [],
        },
        { headers }
      );

      if (response.status === 201) {
        alert("TimeTable created successfully!");
        localStorage.setItem("timeTableData", JSON.stringify(response.data.allTimeTables[0]));
        navigate('/timetable')
      }
    } catch (error) {
      console.error("Error creating timetable:", error);
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };
  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  return (


    <>
      {!user ? (
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
              Don't have an account?{" "}
              <Link to='/signup' className="text-primary" >
                Register Here
              </Link>

            </p>
          </Form>
        </div>
      ) : (
        <>

          <div className="container">
            <h5 className="text-center my-3">Manage Time Table</h5>
            <Form>
              <Form.Label style={{ fontWeight: "bold" }}>Select class</Form.Label>
              <Form.Select size="sm" className="mb-3" value={selectedOption} onChange={handleSelectChange} >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </Form.Select>
              <Button type="submit" className="btn-sm" onClick={(e) => handleManage(e, selectedOption)} style={{ backgroundColor: "#43BE31" }}>
                manage
              </Button>
            </Form>

          </div>
          <div className="container">
            <h5 className="text-center my-3">Create Time Table</h5>
            <Form>
              <Button variant="danger" type="danger" className="btn-sm mb-4" onClick={handleLogout} style={{ backgroundColor: "#BA2F16" }}>
                Logout
              </Button>
              <Form.Group className="mb-3" controlId="formBasicNumber">
                <Form.Control type="number" placeholder="Enter class" className="form-control-sm"
                  name="whichClass"
                  value={settimeTablemData.whichClass}
                  onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicNumber">
                <Form.Control type="number" placeholder="No of days" className="form-control-sm"
                  name="noOfDays"
                  value={settimeTablemData.noOfDays}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicNumber">
                <Form.Control type="number" placeholder="No of period" className="form-control-sm"
                  name="noOfPeriod"
                  value={settimeTablemData.noOfPeriod}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicTime"

              >
                <Form.Control
                  type="time"
                  className="form-control-sm"
                  name="classStartTime"
                  value={timeTableData.classStartTime}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicNumber">
                <Form.Control type="number" placeholder="Duration of each class(in Minites)" className="form-control-sm"
                  name="durationOfEachClass"
                  value={timeTableData.durationOfEachClass}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Label style={{ fontWeight: "bold" }} className="mb-2">Select class</Form.Label>

              <Form.Select size="sm" className="mb-3" value={selectedOption} onChange={handleSelectChange} >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Form.Select>
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
                            settimeTablemData({ ...timeTableData, breakAfterWhichPeriod: newBreakAfterWhichPeriod });
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
                            settimeTablemData({ ...timeTableData, breakDuration: newBreakDuration });
                          }}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </>
              )}

              <Button variant="primary" type="submit" className="btn-sm" onClick={handleSubmit}>
                SUBMIT
              </Button>

            </Form>

          </div>
        </>
      )}


    </>

  )
}

export default Login