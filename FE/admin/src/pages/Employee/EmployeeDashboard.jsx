import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const EmployeeDashboard = () => {

  const { employeeId, eToken, dashData, getDashData, totalFees, cancelSpaAppointment, completeSpaAppointment } = useContext(EmployeeContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (eToken) {
      getDashData()
    }
  }, [eToken])
  
  
  return dashData && (
      <div className='m-5'>
  
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.earning_icon} alt="" />
            <div>
              <p className='text-xl font-semibold text-gray-600'> {currency} {totalFees}</p>
              <p className='text-gray-400'>Earnings</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.appointments_icon} alt="" />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
              <p className='text-gray-400'>Appointments</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.pets_icon} alt="" />
            <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.pets}</p>
            <p className='text-gray-400'>Pets</p></div>
          </div>
        </div>
  
        <div className='bg-white'>
          <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
            <img src={assets.list_icon} alt="" />
            <p className='font-semibold'>Latest Bookings</p>
          </div>
  
          <div className='pt-4 border border-t-0'>
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.customerImgUrl} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.customerName}</p>
                  <p className='text-gray-600 '>Booking on {slotDateFormat(item.appointmentDate)}</p>
                </div>
                {item.cancelled
                  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                    : <div className='flex'>
                      <img onClick={() => cancelAppointment(item.appointmentId)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item.appointmentId)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                    </div>
                }
              </div>
            ))}
          </div>
        </div>
  
      </div>
    )
}

export default EmployeeDashboard