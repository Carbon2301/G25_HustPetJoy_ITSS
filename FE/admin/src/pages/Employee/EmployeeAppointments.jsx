import React from 'react'
import { useContext, useEffect } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const EmployeeAppointments = () => {

  const { eToken, appointments, getSpaAppointment, cancelSpaAppointment, completeSpaAppointment } = useContext(EmployeeContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (eToken) {
      getSpaAppointment()
    }
  }, [eToken])

  return (
      <div className='w-full max-w-6xl m-5 '>
  
        <p className='mb-3 text-lg font-medium'>All Appointments</p>
  
        <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
          <div className='max-sm:hidden grid grid-cols-[0.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
            <p>#</p>
            <p>Pet</p>
            <p>Customer</p>
            <p>Payment</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>
          {appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index}</p>
              <div className='flex items-center gap-2'>
                <img src={item.petImgUrl} className='w-8 rounded-full' alt="" /> <p>{item.petName}</p>
              </div>
              <div className='flex items-center gap-2'>
                <img src={item.customerImgUrl} className='w-8 rounded-full' alt="" /> <p>{item.customerName}</p>
              </div>
              <div>
              <p className={`text-xs inline border ${item.isPaid ? 'border-green-500' : 'border-red-500'} px-2 rounded-full`}>
                  {item.isPaid ? 'Paid' : "Not Paid"}
              </p>
              </div>
              {/* <p className='max-sm:hidden'>{calculateAge(item.customer.dob)}</p> */}
              <p>{slotDateFormat(item.appointmentDate)}</p>
              <p>{currency}{item.fees}</p>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelSpaAppointment(item.appointmentId)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeSpaAppointment(item.appointmentId)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
  
      </div>
    )
}

export default EmployeeAppointments