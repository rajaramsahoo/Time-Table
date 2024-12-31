import React, { useState } from 'react';

const Timetable = ({ data }) => {
  const timetable = data.allTimeTables[0];
  const { classStartTime, durationOfEachClass, noOfPeriod, days, breaks } = timetable;

  // State to manage input values for subjects and teacher names
  const [schedule, setSchedule] = useState(
    days.map((day) => ({
      day: day.day,
      periods: Array(noOfPeriod).fill({ subject: '', teacher: '' }),
    }))
  );

  // Function to calculate time
  const calculateTime = (start, duration) => {
    const [hours, minutes] = start.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Generate timetable with periods and breaks
  const generateTimetable = () => {
    let currentStartTime = classStartTime;
    const timeSlots = [];

    for (let periodIndex = 0; periodIndex < noOfPeriod; periodIndex++) {
      // Period details
      const startTime = currentStartTime;
      const endTime = calculateTime(currentStartTime, durationOfEachClass);
      timeSlots.push({
        type: 'period',
        periodNumber: periodIndex + 1,
        startTime,
        endTime,
      });

      // Update currentStartTime for the next period
      currentStartTime = endTime;

      // Check if a break occurs after this period
      const breakDetails = breaks?.find(
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
        // Update currentStartTime for after the break
        currentStartTime = breakEndTime;
      }
    }
    return timeSlots;
  };

  // Generate time slots
  const timeSlots = generateTimetable();

  // Handle input changes for subject or teacher
  const handleInputChange = (dayIndex, periodIndex, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].periods[periodIndex] = {
      ...updatedSchedule[dayIndex].periods[periodIndex],
      [field]: value,
    };
    setSchedule(updatedSchedule);
  };

  return (
    <table border="1" cellSpacing="0" cellPadding="5" style={{ width: '100%', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>Day</th>
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
            <td>{day.day}</td>
            {timeSlots.map((slot, periodIndex) => (
              <td key={periodIndex}>
                {slot.type === 'period' ? (
                  <>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={schedule[dayIndex].periods[periodIndex]?.subject || ''}
                      onChange={(e) =>
                        handleInputChange(dayIndex, periodIndex, 'subject', e.target.value)
                      }
                      style={{ width: '90%', marginBottom: '5px' }}
                    />
                    <br />
                    <input
                      type="text"
                      placeholder="Teacher"
                      value={schedule[dayIndex].periods[periodIndex]?.teacher || ''}
                      onChange={(e) =>
                        handleInputChange(dayIndex, periodIndex, 'teacher', e.target.value)
                      }
                      style={{ width: '90%' }}
                    />
                  </>
                ) : (
                  'Break'
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Sample data
const data = {
  allTimeTables: [
    {
      classStartTime: '10:23',
      durationOfEachClass: 43,
      noOfPeriod: 7,
      days: [
        { day: 'Monday' },
        { day: 'Tuesday' },
        { day: 'Wednesday' },
        { day: 'Thursday' },
        { day: 'Friday' },
      ],
      breaks: [
        { breakNumber: 1, breakAfterWhichPeriod: '2', breakDuration: 15 },
        { breakNumber: 2, breakAfterWhichPeriod: '5', breakDuration: 20 },
      ],
    },
  ],
};

const App = () => {
  return (
    <div>
      <h1>Class Timetable</h1>
      <Timetable data={data} />
    </div>
  );
};

export default App;
