import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewBill = ({ appointment, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const { backendUrl, token } = useContext(AppContext);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 500);
    };

    const handlePayment = async () => {
        try {
            setIsProcessing(true);
            const { data } = await axios.post(
                `${backendUrl}/api/user/update-payment`,
                { appointmentId: appointment.appointmentId },
                { headers: { token } }
            );
            if (data.success) {
                toast.success("Payment successful!");
                handleClose();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.message || "Payment failed");
            }
        } catch (error) {
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0,
            transition: {
                duration: 0.3,
                when: "afterChildren",
                staggerChildren: 0.1,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: 20, opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
                    >
                        {/* Header with animated gradient background */}
                        <div className="relative overflow-hidden">
                            <motion.div
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                            />
                            <div className="relative p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <motion.h2 
                                        variants={itemVariants}
                                        className="text-2xl font-bold"
                                    >
                                        Appointment Bill
                                    </motion.h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleClose}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Bill Content */}
                        <div className="p-6">
                            {/* Pet Information */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center space-x-4 mb-6"
                            >
                                <motion.img
                                    whileHover={{ scale: 1.1 }}
                                    src={appointment.petImgUrl || assets.pet_placeholder}
                                    alt={appointment.petName}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{appointment.petName}</h3>
                                    <p className="text-gray-600">{appointment.petSpecies}</p>
                                </div>
                            </motion.div>

                            {/* Appointment Details */}
                            <motion.div
                                variants={itemVariants}
                                className="space-y-4 mb-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                                    >
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                                    </motion.div>
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                                    >
                                        <p className="text-sm text-gray-500">Doctor</p>
                                        <p className="font-medium">{appointment.manager?.name}</p>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Treatment Details */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm"
                            >
                                <h4 className="text-lg font-semibold mb-3">Treatment Details</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Consultation Fee</span>
                                        <span className="font-medium">${appointment.treatment?.fees || 100}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            className={`px-2 py-1 rounded-full text-sm ${
                                                appointment.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {appointment.isPaid ? 'Paid' : 'Pending'}
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Total Amount */}
                            <motion.div
                                variants={itemVariants}
                                className="border-t pt-4"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total Amount</span>
                                    <motion.span 
                                        whileHover={{ scale: 1.1 }}
                                        className="text-2xl font-bold text-blue-600"
                                    >
                                        ${appointment.treatment?.fees || 100}
                                    </motion.span>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-6 flex space-x-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleClose()}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    View All Appointments
                                </motion.button>
                                {!appointment.isPaid && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
                                            isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isProcessing ? 'Processing...' : 'Pay Now'}
                                    </motion.button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ViewBill; 