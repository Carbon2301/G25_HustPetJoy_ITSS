import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-800 md:mx-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Bác Sĩ <span className="text-blue-600">Hàng Đầu</span>
      </h1>
      <p className="sm:w-1/2 text-center text-gray-600 leading-relaxed">
        Đội ngũ bác sĩ thú y giàu kinh nghiệm và tận tâm, sẵn sàng chăm sóc thú
        cưng của bạn.
      </p>
      <div className="w-full grid grid-cols-auto gap-6 pt-8 gap-y-8 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              if (item.isWorking) {
                navigate(`/appointment/${item.id}`);
                scrollTo(0, 0);
              }
            }}
            className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ${
              item.isWorking
                ? "cursor-pointer hover:translate-y-[-8px] hover:scale-105"
                : "cursor-not-allowed opacity-60"
            }`}
            key={index}
          >
            <div className="relative overflow-hidden">
              <img
                className="w-full h-48 object-cover bg-gradient-to-b from-blue-50 to-purple-50"
                src={item.imgUrl}
                alt={item.name}
              />
            </div>
            <div className="p-6">
              <h3 className="text-gray-800 text-lg font-semibold mb-1">
                {item.name}
              </h3>
              <p className="text-blue-600 text-sm font-medium mb-3">
                {item.speciality}
              </p>
              <div className="mb-3">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    item.isWorking
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.isWorking ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  {item.isWorking ? "Đang Làm Việc" : "Không Có Mặt"}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">5.0</span>
                </div>
                {item.isWorking && (
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                    Đặt Lịch →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full mt-10 hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
      >
        Xem Tất Cả Bác Sĩ
      </button>
    </div>
  );
};

export default TopDoctors;
