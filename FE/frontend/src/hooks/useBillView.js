import { useState, useCallback, useRef } from 'react';

const useBillView = () => {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isBillVisible, setIsBillVisible] = useState(false);
    const timeoutRef = useRef(null);

    const showBill = useCallback((appointment) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        setSelectedAppointment(appointment);
        setIsBillVisible(true);
    }, []);

    const hideBill = useCallback(() => {
        setIsBillVisible(false);
        
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            setSelectedAppointment(null);
        }, 500); // Match the animation duration
    }, []);

    // Cleanup timeout on unmount
    const cleanup = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return {
        selectedAppointment,
        isBillVisible,
        showBill,
        hideBill,
        cleanup
    };
};

export default useBillView; 