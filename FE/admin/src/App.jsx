import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { EmployeeContext } from './context/EmployeeContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import AddEmployee from './pages/Admin/AddEmployee';
import DoctorsList from './pages/Admin/DoctorsList';
import RoomsManagement from './pages/Admin/RoomsManagement';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import EmployeeAppointments from './pages/Employee/EmployeeAppointments';
import EmployeeProfile from './pages/Employee/EmployeeProfile';
import EmployeeRoomsManagement from './pages/Employee/EmployeeRoomsManagement';
const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const { eToken } = useContext(EmployeeContext)

  // Check for any valid token
  const isAuthenticated = dToken || aToken || eToken

  return isAuthenticated ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/add-employee' element={<AddEmployee />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/rooms-management' element={<RoomsManagement />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/employee-dashboard' element={<EmployeeDashboard />} />
          <Route path='/employee-appointments' element={<EmployeeAppointments />} />
          <Route path='/employee-profile' element={<EmployeeProfile />} />
          <Route path='/rooms-management-employee' element={<EmployeeRoomsManagement />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App