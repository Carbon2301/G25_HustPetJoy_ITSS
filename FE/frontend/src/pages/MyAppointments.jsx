import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import ViewBill from "../components/ViewBill";
import useBillView from "../hooks/useBillView";
import { motion, AnimatePresence } from "framer-motion";

const MyAppointments = () => {
  const { backendUrl, token, userId } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedAppointment, isBillVisible, showBill, hideBill, cleanup } =
    useBillView();

  // Notes modal state
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedAppointmentForNotes, setSelectedAppointmentForNotes] =
    useState(null);
  const [isFollowUpDateModalOpen, setIsFollowUpDateModalOpen] = useState(false);
  const [selectedAppointmentForFollowUpDate, setSelectedAppointmentForFollowUpDate] =
    useState(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments?userId=${userId}`,
        { headers: { token } }
      );
      if (data.success) {
        // Filter out all cancelled appointments (isCancelled = 1)
        const activeAppointments = data.appointments.filter(
          (appointment) =>
            appointment.cancelled !== 1 && appointment.cancelled !== true
        );
        setAppointments(activeAppointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        // Immediately remove the cancelled appointment from the state
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app.appointmentId !== appointmentId)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
    return () => cleanup();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  // Separate appointments by type
  const treatmentAppointments = appointments.filter(
    (app) => app.manager?.speciality?.toLowerCase() === "treatment"
  );

  const spaAppointments = appointments.filter(
    (app) => app.manager?.speciality?.toLowerCase() === "spa"
  );

  const otherAppointments = appointments.filter(
    (app) =>
      app.manager?.speciality?.toLowerCase() !== "treatment" &&
      app.manager?.speciality?.toLowerCase() !== "spa"
  );

  // Component to render a single appointment card
  const AppointmentCard = ({ appointment }) => (
    <motion.div
      key={appointment.appointmentId}
      variants={itemVariants}
      layout
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-6"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={appointment.manager?.imgUrl || assets.doctor_placeholder}
              alt={appointment.manager?.name}
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {appointment.manager?.name}
              </h3>
              {appointment.manager?.speciality?.toLowerCase() ===
              "treatment" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Treatment
                </span>
              ) : appointment.manager?.speciality?.toLowerCase() === "spa" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Spa
                </span>
              ) : (
                <p className="text-gray-600">
                  {appointment.manager?.speciality}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Appointment Date</p>
            <p className="font-medium">
              {formatDate(appointment.appointmentDate)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={appointment.petImgUrl || assets.pet_placeholder}
              alt={appointment.petName}
              className="w-12 h-12 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="font-medium">{appointment.petName}</p>
              <p className="text-sm text-gray-500">{appointment.petSpecies}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-1 rounded-full text-sm ${
                appointment.isCompleted
                  ? "bg-green-100 text-green-800"
                  : appointment.isPaid
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.isCompleted
                ? "Completed"
                : appointment.isPaid
                ? "Paid"
                : "Pending"}
            </motion.span>
            {appointment.notes && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewNotes(appointment)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📝 View Notes
              </motion.button>
            )}
            {appointment.isCompleted && appointment.followUpDate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewFollowUpDate(appointment)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📝 View Follow Up Date
              </motion.button>
            )}
            {!appointment.isPaid && !appointment.isCompleted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => showBill(appointment)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Bill
              </motion.button>
            )}
            {!appointment.isCancelled && !appointment.isCompleted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  handleCancelAppointment(appointment.appointmentId)
                }
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Component to render a column of appointments with a title
  const AppointmentColumn = ({
    title,
    appointments,
    bgColor,
    textColor,
    iconClass,
  }) => (
    <div className="flex-1 px-3">
      <div
        className={`mb-6 rounded-lg ${bgColor} p-4 flex items-center shadow-md`}
      >
        <span className={`${iconClass} mr-2`}></span>
        <h2 className={`text-xl font-bold ${textColor}`}>{title}</h2>
        <span className="ml-2 bg-white text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
          {appointments.length}
        </span>
      </div>
      <AnimatePresence>
        {appointments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm text-gray-500">
            No {title.toLowerCase()} appointments
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.appointmentId}
              appointment={appointment}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );

  // Handle Notes Modal
  const handleViewNotes = (appointment) => {
    setSelectedAppointmentForNotes(appointment);
    setIsNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setSelectedAppointmentForNotes(null);
  };

  const handleViewFollowUpDate = (appointment) => {
    setSelectedAppointmentForFollowUpDate(appointment);
    setIsFollowUpDateModalOpen(true);
  };

  const closeFollowUpDateModal = () => {
    setIsFollowUpDateModalOpen(false);
    setSelectedAppointmentForFollowUpDate(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-8"
      >
        My Appointments
      </motion.h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
          
        >
          <p className="text-gray-500 text-lg">No active appointments found</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row gap-6"
        >
          <AppointmentColumn
            title="Treatment"
            appointments={treatmentAppointments}
            bgColor="bg-blue-500"
            textColor="text-white"
            iconClass="fas fa-stethoscope"
          />

          <AppointmentColumn
            title="Spa"
            appointments={spaAppointments}
            bgColor="bg-purple-500"
            textColor="text-white"
            iconClass="fas fa-spa"
          />

        </motion.div>
      )}

      {/* Bill View Modal */}
      <AnimatePresence>
        {isBillVisible && selectedAppointment && (
          <ViewBill appointment={selectedAppointment} onClose={hideBill} />
        )}
      </AnimatePresence>

      {/* Notes Modal */}
      <AnimatePresence>
        {isNotesModalOpen && selectedAppointmentForNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeNotesModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">📝 Ghi Chú Khám Bệnh</h2>
                    <p className="text-green-100 mt-1">
                      Thú cưng: {selectedAppointmentForNotes.petName}
                    </p>
                    <p className="text-green-100 text-sm">
                      Bác sĩ: {selectedAppointmentForNotes.manager?.name}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeNotesModal}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🩺</span>
                    Ghi Chú Từ Bác Sĩ
                  </h3>
                  {selectedAppointmentForNotes.notes ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedAppointmentForNotes.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Chưa có ghi chú từ bác sĩ cho cuộc hẹn này.
                    </p>
                  )}
                </div>

                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-blue-800 text-sm flex items-center">
                    <span className="mr-2">ℹ️</span>
                    <span>
                      Ghi chú này được tạo bởi bác sĩ sau khi khám và điều trị
                      cho thú cưng của bạn. Vui lòng giữ lại để theo dõi sức
                      khỏe thú cưng.
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeNotesModal}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow Up Date Modal */}
      <AnimatePresence>
        {isFollowUpDateModalOpen && selectedAppointmentForFollowUpDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeFollowUpDateModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">📝 Ngày Tái Khám</h2>
                    <p className="text-green-100 mt-1">
                      Thú cưng: {selectedAppointmentForFollowUpDate.petName}
                    </p>
                    <p className="text-green-100 text-sm">
                      Bác sĩ: {selectedAppointmentForFollowUpDate.manager?.name}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeFollowUpDateModal}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🩺</span>
                    Ngày Tái Khám
                  </h3>
                  {selectedAppointmentForFollowUpDate.followUpDate ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {new Date(selectedAppointmentForFollowUpDate.followUpDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Chưa có ngày tái khám cho cuộc hẹn này.
                    </p>
                  )}
                </div>

                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-blue-800 text-sm flex items-center">
                    <span className="mr-2">ℹ️</span>
                    <span>
                      Ngày tái khám này được tạo bởi bác sĩ sau khi khám và điều trị
                      cho thú cưng của bạn. Vui lòng giữ lại để theo dõi
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeFollowUpDateModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAppointments;
