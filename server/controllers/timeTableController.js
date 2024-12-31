const timeTableModel = require("../models/timeTableModel.js")
const userModel = require("../models/userModel.js")

const createTimeTable = async (req, res) => {
    try {
        const {
            whichClass,
            noOfDays,
            noOfPeriod,
            classStartTime,
            durationOfEachClass,
            breakNumber,
            breakAfterWhichPeriod,
            breakDuration
        } = req.body;

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        if (noOfDays > 7 || noOfDays < 1) {
            return res.status(400).json({ error: "Invalid number of days. It should be between 1 and 7." });
        }

        const days = daysOfWeek.slice(0, noOfDays).map((day) => ({
            day,
            periods: Array.from({ length: noOfPeriod }, (_, index) => ({
                periodNo: `Period ${index + 1}`,
                subject: "",
                teacher: "",
            })),
        }));

        const breaks = breakAfterWhichPeriod.map((period, index) => ({
            breakNumber: index + 1,
            breakAfterWhichPeriod: period,
            breakDuration: breakDuration[index],
        }));

        // Check if the user is logged in
        let userFound = await userModel.findById(req.user._id);
        if (!userFound) {
            return res.status(404).json({ error: 'Please Login' });
        }

        // Check if a timetable already exists for the user and class
        const existingTimetable = await timeTableModel.findOne({ userId: req.user._id, whichClass });
        if (existingTimetable) {
            return res.status(400).json({
                error: `You have already created a timetable for class ${whichClass}. You cannot create another timetable for this class.`,
            });
        }

        // Create a new timetable
        const newTimeTable = await new timeTableModel({
            whichClass,
            noOfDays,
            noOfPeriod,
            classStartTime,
            durationOfEachClass,
            breakes: breaks,
            days,
            userId: req.user._id,
        }).save();

        res.status(201).json({ message: 'TimeTable created successfully', newTimeTable });
    } catch (error) {
        console.error(error);

        // Handle duplicate key error specifically
        if (error.code === 11000) {
            return res.status(400).json({
                error: `Duplicate key error: A timetable for class already exists.`,
            });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};


const userAllTimeTables = async (req, res) => {
    try {
        const { id } = req.params;  // User ID from the URL parameter
        const { whichClass } = req.query; // Class number from the query parameter

        // If the class number is provided, filter by it; otherwise, fetch all timetables
        const query = { userId: id };
        if (whichClass) {
            query.whichClass = whichClass;
        }

        const allTimeTables = await timeTableModel.find(query);

        if (allTimeTables.length === 0) {
            return res.status(200).send({
                success: true,
                message: whichClass ? `No timetable found for class ${whichClass}` : "No timetables found for this user",
                allTimeTables: {},
            });
        }

        res.status(200).send({
            success: true,
            message: whichClass ? `Timetable for class ${whichClass}` : "All timetables of the user",
            allTimeTables,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error: error.message,
            message: "Error while fetching timetables",
        });
    }
};

const updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const { timetableData } = req.body;

        const updatedTimetable = await timeTableModel.findByIdAndUpdate(
            id,
            { $set: timetableData },
            { new: true, runValidators: true }
        );

        if (!updatedTimetable) {
            return res.status(404).send({
                success: false,
                message: `Timetable not found for ID ${id}`,
            });
        }

        res.status(200).send({
            success: true,
            message: 'Timetable replaced successfully',
            updatedTimetable,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error: error.message,
            message: 'Error while replacing timetable',
        });
    }
};



module.exports = { createTimeTable, userAllTimeTables, updateTimetable };