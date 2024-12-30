const { createTimeTable,userAllTimeTables,updateTimetable } = require("../controllers/timeTableController.js")
const express = require("express")
const { authMiddleware } = require("../middlewear/verifyToken.js")
const router = express.Router();

router.post("/createtimetable", authMiddleware, createTimeTable)
router.get("/timetables/:id", userAllTimeTables)
router.put("/timetables/update/:id", updateTimetable)


module.exports = router