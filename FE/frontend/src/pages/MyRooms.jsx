import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ViewBill from "../components/ViewBill";

const MyRooms = () => {
  const { backendUrl, token, userId } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBillVisible, setIsBillVisible] = useState(false);

  // Notes modal state
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState(null);

  const fetchRoomBookings = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/my-room-bookings?userId=${userId}`,
        { headers: { token } }
      );
      if (data.success) {
        // Show all bookings including cancelled ones
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch room bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-room-booking`,
        { bookingId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        // Update the booking status to show as cancelled
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.petRoomId === bookingId
              ? { ...booking, isAvailable: true }
              : booking
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel room booking");
    }
  };

  const showBill = (booking) => {
    setSelectedBooking({ ...booking, isPaid: true });
    setIsBillVisible(true);
  };
  const hideBill = () => {
    setSelectedBooking(null);
    setIsBillVisible(false);
  };

  // Handle Notes Modal
  const handleViewNotes = (booking) => {
    setSelectedBookingForNotes(booking);
    setIsNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
    setSelectedBookingForNotes(null);
  };

  useEffect(() => {
    fetchRoomBookings();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Animation variants
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

  // Calculate stay duration in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-8"
      >
        My Room Bookings
      </motion.h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No active room bookings found</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {bookings.map((booking, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                layout
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={booking.roomImage || assets.room_placeholder}
                    alt={booking.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
                    <h3 className="text-white text-xl font-bold">
                      {booking.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">
                        {formatDate(booking.startDate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs bg-gray-100 rounded-full px-3 py-1">
                        {calculateDuration(booking.startDate, booking.endDate)}{" "}
                        days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">
                        {formatDate(booking.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={booking.petImage || assets.pet_placeholder}
                      alt={booking.petName}
                      className="w-12 h-12 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <p className="font-medium">{booking.petName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.petSpecies}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold text-primary text-lg">
                        $
                        {booking.totalPrice *
                          calculateDuration(
                            booking.startDate,
                            booking.endDate
                          ) +
                          100}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {booking.notes && !booking.isAvailable && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewNotes(booking)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
                        >
                          📝 View Notes
                        </motion.button>
                      )}

                      {booking.isAvailable && (
                        <div>
                          <p className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                            Cancelled
                          </p>
                        </div>
                      )}
                      {!booking.isAvailable && (
                        <div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            onClick={() =>
                              handleCancelBooking(booking.petRoomId)
                            }
                          >
                            Cancel
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Bill View Modal */}
      <AnimatePresence>
        {isBillVisible && selectedBooking && (
          <ViewBill
            appointment={selectedBooking}
            onClose={hideBill}
            alwaysPaid={true}
          />
        )}
      </AnimatePresence>

      {/* Notes Modal */}
      <AnimatePresence>
        {isNotesModalOpen && selectedBookingForNotes && (
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
                    <h2 className="text-2xl font-bold">📝 Ghi Chú Phòng</h2>
                    <p className="text-green-100 mt-1">
                      Phòng: {selectedBookingForNotes.name}
                    </p>
                    <p className="text-green-100 text-sm">
                      Thú cưng: {selectedBookingForNotes.petName}
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
                    <span className="mr-2">🏠</span>
                    Ghi Chú Từ Nhân Viên
                  </h3>
                  {selectedBookingForNotes.notes ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedBookingForNotes.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Chưa có ghi chú từ quản lý cho đặt phòng này.
                    </p>
                  )}
                </div>

                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-blue-800 text-sm flex items-center">
                    <span className="mr-2">ℹ️</span>
                    <span>
                      Ghi chú này được tạo bởi quản lý để thông báo về tình
                      trạng phòng và thú cưng của bạn. Vui lòng đọc kỹ để nắm
                      được thông tin cần thiết.
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
    </div>
  );
};

export default MyRooms;
