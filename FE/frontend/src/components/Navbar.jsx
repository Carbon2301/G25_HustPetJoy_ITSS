import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { token, setToken, userData, appointments, fetchAppointments } = useContext(AppContext)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (token && appointments) {
      // Get notifications from appointments
      const appointmentNotifications = appointments
        .filter(appointment => appointment.noteNotification || appointment.followUpNotification)
        .flatMap(appointment => {
          const notifications = []
          if (appointment.noteNotification) {
            notifications.push({
              id: `note_${appointment.appointmentId}`,
              message: appointment.noteNotification,
              type: 'note',
              appointmentId: appointment.appointmentId,
              timeAgo: 'Vừa xong'
            })
          }
          if (appointment.followUpNotification) {
            notifications.push({
              id: `followup_${appointment.appointmentId}`,
              message: appointment.followUpNotification,
              type: 'followup',
              appointmentId: appointment.appointmentId,
              timeAgo: 'Vừa xong'
            })
          }
          return notifications
        })
      
      setNotifications(appointmentNotifications)
    }
  }, [token, appointments])

  const handleNotificationClick = (notification) => {
    navigate('/my-appointments')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  useEffect(() => {
    if (token) {
      fetchAppointments()
    }
  }, [token])


  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-20 cursor-pointer' src={assets.logo} alt="" />
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>Trang chủ</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>Dịch vụ khám và Spa</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/rooms' >
          <li className='py-1'>Khách sạn thú cưng</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>Về chúng tôi</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>Liên hệ</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <>
                <div className='relative cursor-pointer group' onClick={() => setShowNotifications(!showNotifications)}>
                  <img className='w-6' src={assets.notification_icon} alt="Notifications" />
                  
                
                  
                  {/* Notification Dropdown */}
                  <div className={`absolute top-0 right-0 pt-10 text-base font-medium text-gray-600 z-20 ${showNotifications ? 'block' : 'hidden'} bg-white shadow-md rounded-lg`}>
                    <div className='min-w-64 bg-gray-50 rounded flex flex-col p-4'>
                      <h3 className='font-semibold mb-2'>Thông Báo</h3>
                      <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className='p-2 hover:bg-gray-100 rounded cursor-pointer'
                            >
                              <p className='text-sm'>{notification.message}</p>
                              <p className='text-xs text-gray-500'>{notification.timeAgo}</p>
                            </div>
                          ))
                        ) : (
                          <p className='text-sm text-gray-500 text-center py-2'>Không có thông báo mới</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2 cursor-pointer group relative'>
                  <img className='w-8 rounded-full' src={userData.image} alt="" />
                  <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block bg-white shadow-md rounded-lg  '>
                  <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                    <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                    <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                    <p onClick={() => navigate('/my-rooms')} className='hover:text-black cursor-pointer'>My Rooms</p>
                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                  </div>
                </div>
              </div>
            </>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36 ' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar