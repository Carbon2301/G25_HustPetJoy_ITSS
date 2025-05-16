import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, totalFees, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (dToken) {
      getDashData()
      setIsVisible(true)
    }
  }, [dToken])

  return dashData && (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white p-6'>
      {/* Stats Cards Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Earnings Card */}
        <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='bg-blue-50 p-4 rounded-xl'>
                <img className='w-12 h-12' src={assets.earning_icon} alt="Earnings" />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-800'>{currency} {totalFees}</p>
                <p className='text-gray-500 font-medium'>Total Earnings</p>
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-gray-100'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-500'>This Month</span>
                <span className='text-green-500 font-medium'>+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className={`transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='bg-purple-50 p-4 rounded-xl'>
                <img className='w-12 h-12' src={assets.appointments_icon} alt="Appointments" />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-800'>{dashData.appointments}</p>
                <p className='text-gray-500 font-medium'>Total Appointments</p>
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-gray-100'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-500'>Active</span>
                <span className='text-blue-500 font-medium'>{dashData.appointments - dashData.latestAppointments.filter(a => a.cancelled).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pets Card */}
        <div className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100'>
            <div className='flex items-center gap-4'>
              <div className='bg-green-50 p-4 rounded-xl'>
                <img className='w-12 h-12' src={assets.pets_icon} alt="Pets" />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-800'>{dashData.pets}</p>
                <p className='text-gray-500 font-medium'>Total Pets</p>
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-gray-100'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-500'>This Month</span>
                <span className='text-green-500 font-medium'>+8.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className='flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b'>
          <div className='bg-blue-50 p-2 rounded-lg'>
            <img className='w-6 h-6' src={assets.list_icon} alt="List" />
          </div>
          <h2 className='text-xl font-bold text-gray-800'>Latest Bookings</h2>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div 
              key={index}
              className='flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200'
            >
              <img 
                className='w-12 h-12 rounded-full object-cover ring-2 ring-gray-100' 
                src={item.customerImgUrl} 
                alt={item.customerName} 
              />
              <div className='flex-1 ml-4'>
                <p className='text-gray-800 font-semibold'>{item.customerName}</p>
                <p className='text-gray-500 text-sm'>Booking on {slotDateFormat(item.appointmentDate)}</p>
              </div>
              {item.cancelled ? (
                <span className='px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-500'>
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className='px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-500'>
                  Completed
                </span>
              ) : (
                <div className='flex gap-2'>
                  <button 
                    onClick={() => cancelAppointment(item.appointmentId)}
                    className='p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200'
                  >
                    <img className='w-6 h-6' src={assets.cancel_icon} alt="Cancel" />
                  </button>
                  <button 
                    onClick={() => completeAppointment(item.appointmentId)}
                    className='p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200'
                  >
                    <img className='w-6 h-6' src={assets.tick_icon} alt="Complete" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard