import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [managerId, setManagerId] = useState(
    localStorage.getItem("managerId") ? localStorage.getItem("managerId") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [totalFees, setTotalFees] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [medicines, setMedicines] = useState([]);
  // Getting Doctor appointment data from Database using API
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments?managerId=${managerId}`,
        { headers: { dToken } }
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

  // Getting Doctor profile data from Database using API
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile?managerId=${managerId}`,
        { headers: { dToken } }
      );
      setProfileData(data.profileData);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to cancel doctor appointment using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        // after creating dashboard
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Function to Mark appointment completed using API
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
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

  // Getting Doctor dashboard data using API
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard?managerId=${managerId}`,
        {
          headers: { dToken },
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

  const addMedicine = async (medicineData, appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/add-medicine?appointmentId=${appointmentId}`,
        medicineData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      return false;
    }
  };

  const getMedicines = async (appointmentId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/get-medicines?appointmentId=${appointmentId}`,
        { headers: { dToken } }
      );
      if (data.success) {
        return { medicines: data.medicines, totalPrice: data.totalPrice };
      } else {
        toast.error(data.message);
        return { medicines: [], totalPrice: 0 };
      }
    } catch (error) {
      toast.error(error.message);
      return { medicines: [], totalPrice: 0 };
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    managerId,
    setManagerId,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    totalFees,
    setTotalFees,
    profileData,
    setProfileData,
    getProfileData,
    addMedicine,
    getMedicines,
    totalPrice,
    setTotalPrice,
    medicines,
    setMedicines,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
