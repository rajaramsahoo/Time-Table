import { useState } from 'react'
import Login from './components/Login'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/SignUp';
import TimeTable from './components/TimeTable';
function App() {

  return (
    <Router>

      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/timetable" element={<TimeTable />} />

      </Routes>


    </Router>
  )
}

export default App
