import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
    const { managerId } = useParams();
    const { currencySymbol, backendUrl, token, getDoctorsData, userId, userData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [doctor, setDoctor] = useState(null);
    const [docSlotLength, setdocSlotLength] = useState();
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [selectedPet, setSelectedPet] = useState(null);
    

    const navigate = useNavigate();

    // Fetch doctor details from backend
    const fetchDoctorDetails = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile?managerId=${managerId}`);
            if (data.success) {
                setDoctor(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch doctor details');
        }
    };

    // Fetch available slots for the doctor
    const getAvailableSlots = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/${managerId}/available-slots`);
            if (data.success) {
                setDocSlots(data.data);
                setdocSlotLength(data.docSlotLength)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch available slots');
        }
    };

    // Book an appointment
    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book an appointment');
            return navigate('/login');
        }

        if (!selectedPet) {
            toast.warning('Please select a pet for the appointment');
            return;
        }

        const selectedSlot = docSlots[slotIndex]?.date;
        if (!selectedSlot || !slotTime) {
            toast.warning('Please select a valid slot');
            return;
        }

        const date = new Date(selectedSlot);
        const slotDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        // Determine the endpoint based on speciality
        let endpoint = `${backendUrl}/api/user/book-appointment`;
        if (doctor.speciality.toLowerCase() === 'treatment') {
            endpoint = `${backendUrl}/api/user/book-treatment-appointment`;
        } else if (doctor.speciality.toLowerCase() === 'spa') {
            endpoint = `${backendUrl}/api/user/book-spa-appointment`;
        }

        try {
            const { data } = await axios.post(
                endpoint,
                { 
                    managerId, 
                    slotDate, 
                    slotTime, 
                    userId,
                    petId: selectedPet.id,
                    petName: selectedPet.name,
                    petSpecies: selectedPet.species,
                    petImage: selectedPet.image
                },
                { headers: { token } }
            );

            if (data.success) {
                console.log(data);
                toast.success(data.message);
                getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to book appointment');
        }
    };

    useEffect(() => {
        fetchDoctorDetails();
    }, [managerId]);

    useEffect(() => {
        if (doctor) {
            getAvailableSlots();
        }
    }, [doctor]);

    return doctor ? (
        <div>
            {/* Doctor Details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg my-5' src={doctor.imgUrl} alt='' />
                </div>
                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 my-5 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{doctor.name} <img className='w-5' src={assets.verified_icon} alt='' /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{doctor.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>5 Years</button>
                    </div>
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt='' /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{doctor.about}</p>
                    </div>
                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{100}</span></p>
                </div>
                
            </div>

            {/* Select Your Pet */}
            <div className=" flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 my-[-5] sm:mx-0 mt-[-80px] sm:mt-0">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Select Your Pet</h3>
                
                {!token ? (
                    <p className="text-sm text-gray-500">Please login to select your pet</p>
                ) : userData?.pets?.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userData.pets.map((pet, index) => (
                        <div 
                        key={index}
                        onClick={() => {
                            // console.log(pet);
                            setSelectedPet(pet);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                            selectedPet && (selectedPet.id === pet.id) 
                            ? 'bg-blue-50 border border-primary' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        >
                        <img 
                            src={pet.image || assets.pet_placeholder} 
                            alt={pet.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-xs text-gray-500">{pet.species}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                            {selectedPet && (selectedPet.id === pet.id) && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">You don't have any pets yet</p>
                    <button
                        onClick={() => navigate('/my-profile')}
                        className="text-xs text-primary underline"
                    >
                        Add pets in your profile
                    </button>
                    </div>
                )}
            </div>

            {/* Booking Slots */}
            <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docSlots.map((item, index) => (
                <div
                    onClick={() => setSlotIndex(index)}
                    key={index}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}
                >
                    <p>{daysOfWeek[new Date(item.date).getDay()]}</p>
                    <p>{new Date(item.date).getDate()}</p>
                </div>
            ))}
            </div>
            <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                {docSlots[slotIndex]?.slots.map((slot, index) => (
                    <p
                        onClick={() => setSlotTime(slot)}
                        key={index}
                        className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slot === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}
                    >
                        {slot.toLowerCase()}
                    </p>
                ))}
            </div>

            <button
                onClick={bookAppointment}
                className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'
            >
            Book an appointment
            </button>

            {/* Listing Related Doctors */}
            <RelatedDoctors speciality={doctor.speciality} managerId={managerId} />
        </div>
    ) : null;
};

export default Appointment;
