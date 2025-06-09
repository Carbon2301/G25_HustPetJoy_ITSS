import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-gray-800 bg-white"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Tìm Theo <span className="text-blue-600">Chuyên Khoa</span>
      </h1>
      <p className="sm:w-1/2 text-center text-gray-600 leading-relaxed">
        Dễ dàng tìm kiếm bác sĩ thú y theo chuyên khoa phù hợp với nhu cầu chăm
        sóc thú cưng của bạn.
      </p>
      <div className="flex sm:justify-center gap-6 pt-8 w-full overflow-x-auto px-4 scrollbar-hide">
        {specialityData.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-sm cursor-pointer flex-shrink-0 hover:translate-y-[-10px] hover:scale-105 transition-all duration-500 group p-4 rounded-2xl hover:bg-blue-50"
            key={index}
          >
            <div className="bg-blue-50 p-4 rounded-2xl mb-3 group-hover:bg-blue-100 transition-colors duration-300">
              <img
                className="w-16 sm:w-20 h-16 sm:h-20 object-cover"
                src={item.image}
                alt={item.speciality}
              />
            </div>
            <p className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300 text-center">
              {capitalizeFirstLetter(item.speciality)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
