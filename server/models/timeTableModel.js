const mongoose = require("mongoose");
const timeTableSchema = new mongoose.Schema({
    whichClass: {
        type: Number,
        required: true,
        unique: true,
    },
    noOfDays: {
        type: Number,
        required: true,

    },
    noOfPeriod: {
        type: Number,
        required: true,
    },
    classStartTime: {
        type: String,
        required: true,
    },
    durationOfEachClass: {
        type: Number,
        required: true,
    },
    breakes: [
        {
            breakNumber: {
                type: Number,
                required: true,
            },
            breakAfterWhichPeriod: {
                type: String,
                required: true,
            },
            breakDuration: {
                type: Number,
                required: true,
            },
        },
    ],
    days: [
        {
            day: String,
            periods: [
                {
                    periodNo:String,
                    subject: String,
                    teacher: String,
                },
            ],
        },
    ],
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },


}, { timestamps: true });
module.exports = mongoose.model("timeTableModel", timeTableSchema);