import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const TimaTable1 = () => {
    const [timetable, setTimetable] = useState(JSON.parse(localStorage.getItem("timeTableData")));
    // console.log(timetable)
    const { classStartTime, durationOfEachClass, noOfPeriod, days, breakes } = timetable;
    const calculateTime = (startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number)
        const totalMinutes = hours * 60 + minutes + duration
        const newHours = Math.floor(totalMinutes / 60) % 24
        const newMinutes = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
    // calculateTime("8:10", 45)

    const generateTimetable = () => {
        let currentStartTime = classStartTime;
        const timeSlots = []
        for (let periodIndex = 0; periodIndex < noOfPeriod; periodIndex++) {
            const startTime = currentStartTime;
            const endTime = calculateTime(startTime, durationOfEachClass)
            timeSlots.push({
                type: 'period',
                periodNumber: periodIndex + 1,
                startTime,
                endTime,
                days
            });
            currentStartTime = endTime;
            const breakDetails = breakes?.find(
                (breakItem) => breakItem.breakAfterWhichPeriod === (periodIndex + 1).toString()
            )
            if (breakDetails) {
                const breakStartTime = currentStartTime;
                const breakEndTime = calculateTime(currentStartTime, breakDetails.breakDuration)
                timeSlots.push({
                    type: 'break',
                    breakNumber: breakDetails.breakNumber,
                    startTime: breakStartTime,
                    endTime: breakEndTime,
                });
                currentStartTime = breakEndTime
            }
        }
        return timeSlots;
    }
    const timeSlots = generateTimetable();
    console.log(timeSlots)
    const [schedule, setSchedule] = useState(
        timetable.days.map((day) => ({
            day: day.day,
            periods: day.periods.map((period) => ({
                subject: period.subject || '',
                teacher: period.teacher || '',
            })),
        }))
    );
  
    return (
        <div className="m-3 px-md-5 px-sm-3">

            <h6 className="text-center mb-4">Time Table - Class {timetable.whichClass}</h6>

            <Row className="mb-2">
                <Col className="d-flex justify-content-start">
                    <Button variant="danger" className="btn-sm" >Logout</Button>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" className="btn-sm" >Go Back</Button>
                </Col>
            </Row>
            <Table striped
                bordered
                hover
                className="p-3"
                style={{ fontSize: '0.8rem' }}>
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
                                <td key={slotIndex}>
                                    {slot.type === 'period' ? (
                                        <div className="flex flex-col">
                                            <p>{day.periods[slotIndex]?.subject || "Enter Subject"}</p>
                                            <p>{day.periods[slotIndex]?.teacher || "Enter Teacher"}</p>
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

        </div>
    )
}

export default TimaTable1