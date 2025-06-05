import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    addMedicine,
    getMedicines
  } = useContext(DoctorContext);
  const { slotDateFormat, currency, backendUrl } = useContext(AppContext);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicine, setMedicine] = useState("");
  const [type, setType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMedicinesModalOpen, setIsMedicinesModalOpen] = useState(false);
  const [existingMedicines, setExistingMedicines] = useState([]);
  const [totalMedicinePrice, setTotalMedicinePrice] = useState(0);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(true);
  const [followUpDate, setFollowUpDate] = useState("");

  // Notes state
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedAppointmentForNotes, setSelectedAppointmentForNotes] =
    useState(null);

  const medicineOptions = {
    Antibiotic: [
      "Amoxicillin (Vet)",
      "Cefpodoxime",
      "Clindamycin",
      "Doxycycline",
    ],
    Painkiller: ["Carprofen", "Meloxicam", "Firocoxib", "Tramadol"],
    Vitamin: [
      "Vitamin B Complex",
      "Vitamin E",
      "Vitamin C (Vet)",
      "Multivitamin for Pets",
    ],
    Dewormer: [
      "Fenbendazole",
      "Praziquantel",
      "Pyrantel Pamoate",
      "Ivermectin",
    ],
    Other: [
      "Probiotic for Pets",
      "Antihistamine (Vet)",
      "Cough Suppressant",
      "Antacid (Vet)",
    ],
  };

  useEffect(() => {
    if (dToken) {
      getAppointments();
      setIsVisible(true);
    }
  }, [dToken]);

  const handleAddMedicine = async () => {
    if (selectedAppointment && type && medicine) {
      try {
        const medicineData = { type, name: medicine };
        const success = await addMedicine(
          medicineData,
          selectedAppointment.appointmentId
        );

        if (success) {
          await getAppointments();
          setIsModalOpen(false);
          setType("");
          setMedicine("");
        } else {
          alert("Failed to add medicine. Please try again.");
        }
      } catch (error) {
        console.error("Error adding medicine:", error);
        alert("An error occurred while adding medicine. Please try again.");
      }
    } else {
      alert("Please select a type and medicine before adding.");
    }
  };

  const handleViewMedicines = async (appointment) => {
    try {
      const { medicines, totalPrice } = await getMedicines(
        appointment.appointmentId
      );
      setExistingMedicines(medicines);
      setTotalMedicinePrice(totalPrice);
      setIsMedicinesModalOpen(false);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to fetch medicines. Please try again.");
    }
  };

  // Handle Notes Modal
  const handleOpenNotesModal = (appointment) => {
    setSelectedAppointmentForNotes(appointment);
    setNotes(appointment.notes || "");
    setIsNotesModalOpen(true);
  };

  const handleUpdateNotes = async () => {
    if (!selectedAppointmentForNotes) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/notes-appointment`,
        {
          appointmentId: selectedAppointmentForNotes.appointmentId,
          notes: notes,
        },
        {
          headers: { dToken },
        }
      );

      if (response.data.success) {
        toast.success("Ghi chú đã được cập nhật thành công!");
        setIsNotesModalOpen(false);
        setNotes("");
        setSelectedAppointmentForNotes(null);
        await getAppointments();
      } else {
        toast.error("Không thể cập nhật ghi chú. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật ghi chú. Vui lòng thử lại.");
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!selectedAppointment || !followUpDate) {
      toast.error("Vui lòng chọn ngày tái khám");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/follow-up-appointment`,
        {
          appointmentId: selectedAppointment.appointmentId,
          followUpDate: followUpDate,
        },
        {
          headers: { dToken },
        }
      );

      if (response.data.success) {
        toast.success("Đã lên lịch tái khám thành công!");
        setIsFollowUpModalOpen(true);
        setSelectedAppointment(null);
        await getAppointments();
      } else {
        toast.error("Không thể lên lịch tái khám. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
      toast.error("Đã xảy ra lỗi khi lên lịch tái khám. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`mb-8 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            HustPetJoy - Quản Lý Lịch Hẹn
          </h1>
          <p className="text-gray-800">
            Quản lý và theo dõi tất cả các cuộc hẹn khám thú cưng
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transform transition-all duration-700 delay-100 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 12 24"
                >
                  <svg
                  className="w-8 h-8 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                  <path                
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {appointments.filter((a) => a.isCompleted).length}
                </p>
                <p className="text-gray-500 font-medium">Đã Hoàn Thành</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-xl">
              
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div
          className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-700 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Tất Cả Các Lịch Hẹn
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-4 text-sm font-medium text-gray-500">Pet</th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Payment
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Date & Time
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Fees
                  </th>
                  <th className="p-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.petImgUrl}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          alt=""
                        />
                        <span className="font-medium text-gray-800">
                          {item.petId}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.customerImgUrl}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          alt=""
                        />
                        <span className="font-medium text-gray-800">
                          {item.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          item.isPaid
                            ? "bg-green-50 text-green-600"
                        }`}
                      >
                        {item.isPaid ? "Paid" : "Not Paid"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {slotDateFormat(item.appointmentDate)}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {currency}
                      {item.fees}
                    </td>
                    <td className="p-4">
                      {item.cancelled ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                      ) : (
                      )}
                    </td>
                    <td className="p-4">
                      {!item.cancelled && !item.isCompleted && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              cancelAppointment(item.appointmentId)
                            }
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-200"
                          >
                            <img
                              className="w-5 h-5"
                              src={assets.cancel_icon}
                              alt="Cancel"
                            />
                          </button>
                          <button
                            onClick={() =>
                              completeAppointment(item.appointmentId)
                            }
                            className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200"
                          >
                            <img
                              className="w-5 h-5"
                              src={assets.tick_icon}
                              alt="Complete"
                            />
                          </button>
                          <button
                            onClick={() => handleViewMedicines(item)}
                            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-xs font-medium"
                          >
                            Xem đơn thuốc
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(item);
                              setIsModalOpen(true);
                            }}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs font-medium"
                          >
                            Thêm thuốc
                          </button>
                          <div className="rounded-4xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="bg-purple-50 p-4 rounded-xl">
                                <svg
                                  className="w-8 h-8 text-purple-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleOpenNotesModal(item)}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-xs font-medium"
                          >
                            {item.notes ? "Chỉnh sửa ghi chú" : "Thêm ghi chú"}
                          </button>
                        </div>
                      )}
                      {(item.cancelled || item.isCompleted) && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewMedicines(item)}
                            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-xs font-medium"
                          >
                            Xem đơn thuốc
                          </button>
                          <button
                            onClick={() => handleOpenNotesModal(item)}
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-xs font-medium"
                          >
                            Xem ghi chú
                          </button>
                          {item.isCompleted && !item.followUpDate && (
                            <button
                              onClick={() => {
                                setSelectedAppointment(item);
                                setIsFollowUpModalOpen(true);
                              }}
                              className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 text-xs font-medium"
                            >
                              Lên Lịch Tái Khám
                            </button>
                          )}
                          {item.isCompleted && item.followUpDate && (
                            <span className="px-3 py-2 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">
                              Đã hẹn lịch tái khám vào: {new Date(item.followUpDate).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Medicine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 ${
              isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Thêm Thuốc</h2>
              <p className="text-sm text-gray-500 mt-1">
                Mã lịch hẹn: {selectedAppointment?.appointmentId}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại Thuốc
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setMedicine("");
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {Object.keys(medicineOptions).map((typeOption) => (
                    <option key={typeOption} value={typeOption}>
                      {typeOption}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Thuốc
                </label>
                <select
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  disabled={!type}
                >
                  <option value="" disabled>
                    Select medicine
                  </option>
                  {type &&
                    medicineOptions[type].map((medicineOption) => (
                      <option key={medicineOption} value={medicineOption}>
                        {medicineOption}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleAddMedicine}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              >
                Thêm Thuốc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Medicines Modal */}
      {isMedicinesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Đơn thuốc
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Mã lịch hẹn: {selectedAppointment?.appointmentId}
              </p>
            </div>

            <div className="p-6">
              {existingMedicines && existingMedicines.length > 0 ? (
                <div className="space-y-4">
                  {existingMedicines.map((med, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {med.medicineName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Type: {med.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {med.days} days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {currency}
                          {med.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: {currency}
                          {med.totalPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có đơn thuốc.</p>
                  <button
                    onClick={() => {
                      setIsMedicinesModalOpen(false);
                      setSelectedAppointment(selectedAppointment);
                      setIsModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Thêm thuốc
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <span className="font-bold text-lg text-gray-800">
                Tổng tiền đơn thuốc: {currency}
                {totalMedicinePrice}
              </span>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              {existingMedicines && existingMedicines.length > 0 && (
                <button
                  onClick={() => {
                    setIsMedicinesModalOpen(false);
                    setSelectedAppointment(selectedAppointment);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add More Medicine
                </button>
              )}
              <button
                onClick={() => setIsMedicinesModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ${
              isNotesModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedAppointmentForNotes?.notes
                  ? "Chỉnh Sửa Ghi Chú"
                  : "Thêm Ghi Chú"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Mã lịch hẹn: {selectedAppointmentForNotes?.appointmentId}
              </p>
              <p className="text-sm text-gray-500">
                Thú cưng: {selectedAppointmentForNotes?.petName}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ghi Chú Khám Bệnh
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú về tình trạng sức khỏe, chẩn đoán, điều trị..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                rows="6"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ghi chú này sẽ được lưu vào hồ sơ khám bệnh của thú cưng.
              </p>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsNotesModalOpen(false);
                  setNotes("");
                  setSelectedAppointmentForNotes(null);
                }}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateNotes}
                disabled={!notes.trim()}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                  notes.trim()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedAppointmentForNotes?.notes
                  ? "Cập Nhật"
                  : "Thêm Ghi Chú"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Appointment Modal */}
      {isFollowUpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Lên Lịch Tái Khám</h2>
              <p className="text-sm text-gray-500 mt-1">
                Mã lịch hẹn: {selectedAppointment?.appointmentId}
              </p>
              <p className="text-sm text-gray-500">
                Thú cưng: {selectedAppointment?.petName}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày Tái Khám
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
                />
              </div>
              <p className="text-xs text-gray-500">
                Vui lòng chọn ngày tái khám cho thú cưng. Ngày tái khám phải sau ngày hiện tại.
              </p>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsFollowUpModalOpen(false);
                  setFollowUpDate("");
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleScheduleFollowUp}
                disabled={!followUpDate}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  followUpDate
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
