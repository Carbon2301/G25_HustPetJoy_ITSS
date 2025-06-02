import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 shadow-2xl overflow-hidden">
      {/* ------- Left Side ------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight">
          <p className="mb-2">Đặt Lịch Hẹn</p>
          <p className="text-yellow-300">Với 100+ Bác Sĩ Thú Y</p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mt-4 opacity-90">
            Uy Tín & Chuyên Nghiệp
          </p>
        </div>
        <p className="text-white opacity-80 mt-4 text-sm sm:text-base max-w-md">
          Tham gia cộng đồng HustPetJoy để nhận được sự chăm sóc tốt nhất cho
          thú cưng yêu quý của bạn.
        </p>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-gray-700 text-sm sm:text-base px-8 py-3 rounded-full mt-6 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium inline-flex items-center gap-2"
        >
          Tạo Tài Khoản
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>

      {/* ------- Right Side ------- */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          className="w-full absolute bottom-0 right-0 max-w-md transform hover:scale-105 transition-transform duration-500"
          src={assets.appointment_img}
          alt="HustPetJoy Appointment"
        />
      </div>
    </div>
  );
};

export default Banner;
