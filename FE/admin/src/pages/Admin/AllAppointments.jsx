import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency, formatTime} = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='sm:grid grid-cols-[0.5fr_1fr_1fr_2.5fr_3fr_3fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Pet</p>
          <p>Customer</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Action</p>
          <p>Fees</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex flex-wrap justify-between py-4 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index+1}</p>
            {/* PetName */}
            <div className='flex items-center gap-8'>
              <p>{item.petName}</p>
            </div>

            <div className='flex items-center gap-8'>
              <p>{item.customerName}</p>
            </div>
            {/* <p className='max-sm:hidden'>{calculateAge(item.customer.dob)}</p> */}
            <p>{slotDateFormat(item.appointmentDate)}, {formatTime(item.appointmentTime)}</p>
            {/* <p>{currency}{item.amount}</p> */}
            {item.cancelled ? <p className='text-red-400 text-xs font-medium'>Cancelled</p> : item.isCompleted ? <p className='text-green-500 text-xs font-medium'>Completed</p> : <img onClick={() => cancelAppointment(item.appointmentId)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
            <div className='flex items-center gap-8'>
              <p>{item.fees }$</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default AllAppointments