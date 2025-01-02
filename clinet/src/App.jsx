import { useState } from 'react'
import Login from './components/Login'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/SignUp';
import TimeTable from './components/TimeTable';
import Demo from './components/Demo';
import TimaTable1 from './components/TimaTable1';
function App() {

  return (
    <Router>

      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/timetable1" element={<TimeTable />} />
        <Route path="/time" element={<Demo />} /> */}
        <Route path="/timetable" element={<TimaTable1 />} />

      </Routes>


    </Router>
  )
}

export default App
