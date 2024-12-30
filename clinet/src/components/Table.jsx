import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const Table = () => {
    // Initial state setup
    const [data, setData] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem("timetableData"));
        return (
            storedData 
        );
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [subjectName, setSubjectName] = useState("");
    const [teacherName, setTeacherName] = useState("");

    const generateDays = () => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        return days.slice(0, data.noOfDays);
    };

    const handleModalClose = () => setShowModal(false);

    const handleModalShow = (day, periodIndex) => {
        setSelectedCell({ day, periodIndex });
        const selectedPeriod = data.days.find((row) => row.day === day)?.periods[periodIndex];
        setSubjectName(selectedPeriod?.subject || "");
        setTeacherName(selectedPeriod?.teacher || "");
        setShowModal(true);
    };

    const handleSave = () => {
        if (selectedCell) {
            const { day, periodIndex } = selectedCell;
            const updatedData = data.days.map((row) =>
                row.day === day
                    ? {
                        ...row,
                        periods: row.periods.map((period, index) =>
                            index === periodIndex
                                ? { ...period, subject: subjectName, teacher: teacherName }
                                : period
                        ),
                    }
                    : row
            );

            const newData = { ...data, days: updatedData };
            setData(newData);

            // Save updated data to localStorage
            setShowModal(false);
        }
    };

    useEffect(() => {
        const daysWithPeriods = generateDays().map((day) => ({
            day,
            periods: Array.from({ length: data.noOfPeriod }, () => ({
                subject: "",
                teacher: "",
            })),
        }));

        // Insert breaks into the periods
        data.breaks.forEach((breakItem) => {
            const breakPeriodIndex = parseInt(breakItem.breakAfterWhichPeriod) - 1; // 0-based index
            daysWithPeriods.forEach((day) => {
                day.periods.splice(breakPeriodIndex, 0, {
                    subject: "Break",
                    teacher: "",
                });
            });
        });

        // Only initialize timetable data if it doesn't already have days
        if (!data.days) {
            const newData = { ...data, days: daysWithPeriods };
            setData(newData);
            localStorage.setItem("timetableData", JSON.stringify(newData));
        }
    }, [data.noOfDays, data.noOfPeriod, data.breaks]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Editable Time Table</h2>
            <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Day</th>
                        {[...Array(data.noOfPeriod)].map((_, index) => (
                            <th key={index} className="border border-gray-300 px-4 py-2">
                                {data.breaks.some(
                                    (b) => parseInt(b.breakAfterWhichPeriod) === index + 1
                                )
                                    ? "Break"
                                    : `Period ${index + 1}`}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.days &&
                        data.days.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="border border-gray-300 px-4 py-2">{row.day}</td>
                                {row.periods.map((period, periodIndex) => (
                                    <td
                                        key={periodIndex}
                                        className="border border-gray-300 px-4 py-2 cursor-pointer"
                                        onClick={() =>
                                            period.subject !== "Break" && handleModalShow(row.day, periodIndex)
                                        }
                                    >
                                        {period.subject === "Break" ? (
                                            <div className="text-center">Break</div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <p>{period.subject || "Enter Subject"}</p>
                                                <p>{period.teacher || "Enter Teacher"}</p>
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Modal for Subject Name and Teacher Name */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Subject and Teacher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="subject">
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                placeholder="Enter Subject"
                            />
                        </Form.Group>
                        <Form.Group controlId="teacher">
                            <Form.Label>Teacher Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                placeholder="Enter Teacher"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Table;
