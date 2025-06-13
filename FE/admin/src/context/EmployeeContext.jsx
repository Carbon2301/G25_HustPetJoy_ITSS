import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [eToken, setEToken] = useState(
    localStorage.getItem("eToken") ? localStorage.getItem("eToken") : ""
  );
  const [managerId, setManagerId] = useState(
    localStorage.getItem("managerId") ? localStorage.getItem("managerId") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [totalFees, setTotalFees] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Room Management States
  const [rooms, setRooms] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);

  // Getting Employee appointment data from Database using API
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/employee/profile?managerId=${managerId}`,
        { headers: { eToken } }
      );
      setProfileData(data.profileData);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/employee/dashboard?managerId=${managerId}`,
        {
          headers: { eToken },
        }
      );

      if (data.success) {
        setDashData(data.dashData);
        setTotalFees(data.totalFees);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getSpaAppointment = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/employee/appointments?managerId=${managerId}`,
        { headers: { eToken } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const completeSpaAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/employee/complete-appointment",
        { appointmentId },
        { headers: { eToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getSpaAppointment();
        // Later after creating getDashData Function
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const cancelSpaAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/employee/cancel-appointment",
        { appointmentId },
        { headers: { eToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getSpaAppointment();
        // after creating dashboard
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Room Management Functions
  const getRooms = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/rooms`, {
        headers: { eToken },
      });

      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch rooms");
    }
  };

  const getRoomBookings = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/employee/room-bookings`,
        {
          headers: { eToken },
        }
      );

      if (data.success) {
        setRoomBookings(data.roomBookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch room bookings");
    }
  };

  const getPetInfo = async (petId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/pet`, {
        headers: { eToken },
        params: { id: petId },
      });

      if (data.success) {
        return data.pet;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pet information");
      return null;
    }
  };

  const updateRoomNotes = async (petRoomId, notes) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/employee/notes-room`,
        { petRoomId, notes },
        { headers: { eToken } }
      );

      if (data.success) {
        toast.success("Ghi chú đã được cập nhật thành công!");
        await getRoomBookings(); // Refresh bookings
        return true;
      } else {
        toast.error(data.message || "Không thể cập nhật ghi chú");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi cập nhật ghi chú");
      return false;
    }
  };

  const value = {
    eToken,
    setEToken,
    backendUrl,
    managerId,
    setManagerId,
    appointments,
    getSpaAppointment,
    cancelSpaAppointment,
    completeSpaAppointment,
    dashData,
    getDashData,
    totalFees,
    setTotalFees,
    profileData,
    setProfileData,
    getProfileData,
    // Room Management
    rooms,
    roomBookings,
    getRooms,
    getRoomBookings,
    getPetInfo,
    updateRoomNotes,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {props.children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContextProvider;
