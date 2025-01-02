import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const TimeTable = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const classNumber = JSON.parse(localStorage.getItem("timeTableData")).whichClass
    console.log(classNumber)
    const navigate = useNavigate();
    const [timetable, setTimetable] = useState(JSON.parse(localStorage.getItem("timeTableData")));
    console.log(timetable._id)

    const periods = timetable.days[0].periods.map(period => period.periodNo);
    const [show, setShow] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [subject, setSubject] = useState('');
    const [teacher, setTeacher] = useState('');

    const handleClose = () => setShow(false);

    const handleShow = (dayIndex, periodIndex) => {
        setSelectedPeriod({ dayIndex, periodIndex });
        const period = timetable.days[dayIndex].periods[periodIndex];
        setSubject(period.subject || '');
        setTeacher(period.teacher || '');
        setShow(true);
    };

    const updatePeriod = async () => {
        const updatedTimetable = { ...timetable };

        const { dayIndex, periodIndex } = selectedPeriod;
        updatedTimetable.days[dayIndex].periods[periodIndex].subject = subject;
        updatedTimetable.days[dayIndex].periods[periodIndex].teacher = teacher;
        setTimetable(updatedTimetable);
        localStorage.setItem("timeTableData", JSON.stringify(updatedTimetable));

        try {
            const update = await axios.put(`https://time-table-backend-6pp1.onrender.com/api/v2/timetables/update/${timetable._id}`, { timetableData: updatedTimetable });
            console.log(updatedTimetable)
            console.log(update.data);
            setShow(false);
        } catch (error) {
            console.error("Error updating timetable:", error);
        }
    };

    if (!timetable) {
        return <div>Loading timetable...</div>;
    }



    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleBack = () => {
        localStorage.removeItem("timeTableData");
        navigate("/login");
    };









    return (
        <div className="m-3" style={{ paddingLeft: '210px', paddingRight: '210px' }}>
            <h6 className="text-center mb-4">Time Table - Class {timetable.whichClass}</h6>

            <Row className="mb-2">
                <Col className="d-flex justify-content-start">
                    <Button variant="danger" className="btn-sm" onClick={handleLogout}>Logout</Button>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" className="btn-sm" onClick={handleBack}>Go Back</Button>
                </Col>
            </Row>

            {/* Table */}
            <Table
                striped
                bordered
                hover
                className="p-3"
                style={{ fontSize: '0.8rem' }}
            >
                <thead>
                    <tr>
                        <th style={{ width: '12%', height: "50px", alignContent: "center" }}>Weekdays</th>
                        {periods.map((ele, index) => (
                            <th key={index} style={{ width: '10%', height: "50px", alignContent: "center" }}>{ele}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timetable.days &&
                        timetable.days.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="border border-gray-300 px-4 py-2">{row.day}</td>
                                {row.periods.map((period, periodIndex) => (
                                    <td
                                        key={periodIndex}
                                        className="border border-gray-300 px-4 py-2 cursor-pointer"
                                        onClick={() =>
                                            period.subject !== "Break" && handleShow(rowIndex, periodIndex)
                                        }
                                    >
                                        {period.periodNo === "Break" ? (
                                            <div className="text-center">Break</div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <p>{period.subject || "Enter Subject"}</p>
                                                <p>{period.teacher || " Teacher Name"}</p>
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Period</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                    <div>
                        <label>Teacher:</label>
                        <input
                            type="text"
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value)}
                            className="form-control mb-2"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updatePeriod}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TimeTable;

