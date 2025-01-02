import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TimaTable1 = () => {
    const navigate = useNavigate();

    const [timetable, setTimetable] = useState(JSON.parse(localStorage.getItem("timeTableData")));
    const { classStartTime, durationOfEachClass, noOfPeriod, days, breakes } = timetable;

    const calculateTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    };

    const generateTimetable = () => {
        let currentStartTime = classStartTime;
        const timeSlots = [];

        // Generate periods and breaks
        for (let periodIndex = 0; periodIndex < noOfPeriod; periodIndex++) {
            const startTime = currentStartTime;
            const endTime = calculateTime(startTime, durationOfEachClass);
            timeSlots.push({
                type: 'period',
                periodNumber: periodIndex + 1,
                startTime,
                endTime,
                days,
            });
            currentStartTime = endTime;

            const breakDetails = breakes?.find(
                (breakItem) => breakItem.breakAfterWhichPeriod === (periodIndex + 1).toString()
            );
            if (breakDetails) {
                const breakStartTime = currentStartTime;
                const breakEndTime = calculateTime(currentStartTime, breakDetails.breakDuration);
                timeSlots.push({
                    type: 'break',
                    breakNumber: breakDetails.breakNumber,
                    startTime: breakStartTime,
                    endTime: breakEndTime,
                });
                currentStartTime = breakEndTime;
            }
        }
        return timeSlots;
    };

    const timeSlots = generateTimetable();

    const [schedule, setSchedule] = useState(
        timetable.days.map((day) => ({
            day: day.day,
            periods: day.periods.map((period) => ({
                subject: period.subject || '',
                teacher: period.teacher || '',
            })),
        }))
    );
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
    useEffect(() => {
        if (timetable) {
            setSchedule(
                timetable.days.map((day) => ({
                    day: day.day,
                    periods: day.periods.map((period) => ({
                        subject: period.subject || '',
                        teacher: period.teacher || '',
                    })),
                }))
            );
        }
    }, [timetable]);


    return (
        <div className="m-3 px-md-5 px-sm-3">
            <h6 className="text-center mb-4">Time Table - Class {timetable.whichClass}</h6>

            <Row className="mb-2">
                <Col className="d-flex justify-content-start">
                    <Button variant="danger" className="btn-sm" onClick={handleLogout}>Logout</Button>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" className="btn-sm" onClick={handleBack}>Go Back</Button>
                </Col>
            </Row>

            <Table striped bordered hover className="p-3" style={{ fontSize: '0.8rem' }}>
                <thead>
                    <tr>
                        <th>Weekdays</th>
                        {timeSlots.map((slot, index) => (
                            <th key={index}>
                                {slot.type === 'period'
                                    ? `Period ${slot.periodNumber}`
                                    : `Break ${slot.breakNumber}`}
                                <br />
                                ({slot.startTime} - {slot.endTime})
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((day, dayIndex) => (
                        <tr key={dayIndex}>
                            <td className="text-center">{day.day}</td>
                            {timeSlots.map((slot, slotIndex) => (
                                <td key={slotIndex}
                                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                                    onClick={() =>
                                        handleShow(dayIndex, slotIndex)
                                    }
                                >

                                    {slot.type === 'period' ? (
                                        <div className="flex flex-col">
                                            <p>{day.periods[slot.periodNumber - 1]?.subject || "Enter Subject"}</p>
                                            <p>{day.periods[slot.periodNumber - 1]?.teacher || "Enter Teacher"}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">Break</div>
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

export default TimaTable1;
