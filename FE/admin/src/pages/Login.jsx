import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { EmployeeContext } from '../context/EmployeeContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)
  const { setEToken } = useContext(EmployeeContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {
      let response;
  
      if (state === 'Admin') {
        response = await axios.post(backendUrl + '/api/admin/login', { email, password });

        if (response.data.success) {
          setAToken(response.data.token);
          localStorage.setItem('aToken', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else if (state === 'Doctor') {
        response = await axios.post(backendUrl + '/api/doctor/login', { email, password });
        if (response.data.success) {
          setDToken(response.data.token);
          localStorage.setItem('dToken', response.data.token);
          localStorage.setItem('managerId', response.data.managerId);
        } else {
          toast.error(response.data.message);
        }
      } else if (state === 'Employee') {
        response = await axios.post(backendUrl + '/api/employee/login', { email, password });
        if (response.data.success) {
          setEToken(response.data.token);
          localStorage.setItem('eToken', response.data.token);
          localStorage.setItem('managerId', response.data.managerId);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      // Bắt lỗi nếu có vấn đề kết nối hoặc lỗi hệ thống
      toast.error("Your email or password is wrong. Or you don't have permission");
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
        <div className='flex justify-between w-full'>
          {
            state === 'Admin' ? (
              <p className='text-center w-full flex justify-between'>
                <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Doctor Login?</span>
                <span onClick={() => setState('Employee')} className='text-primary underline cursor-pointer'>Employee Login?</span>
              </p>
            ) : state === 'Doctor' ? (
              <p className='text-center w-full flex justify-between'>
                <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Admin Login?</span>
                <span onClick={() => setState('Employee')} className='text-primary underline cursor-pointer'>Employee Login?</span>
              </p>
            ) : (
              <p className='text-center w-full flex justify-between'>
                <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Admin Login?</span>
                <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Doctor Login?</span>
              </p>
            )
          }
        </div>
      </div>
    </form>
  )
}

export default Login