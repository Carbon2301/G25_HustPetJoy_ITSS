import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ABOUT <span className="text-blue-600">US</span>
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-slide-in">
            <img
              className="w-full h-auto rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
              src={assets.about_image}
              alt="About HustPetJoy Veterinary Clinic"
            />
          </div>
          <div className="space-y-6 animate-slide-in">
            <p className="text-gray-600 leading-relaxed">
              Chào mừng bạn đến với HustPetJoy - Phòng Khám Thú Y, đối tác tin
              cậy của bạn trong việc chăm sóc sức khỏe thú cưng một cách tiện
              lợi và hiệu quả. Tại HustPetJoy, chúng tôi hiểu rằng thú cưng là
              thành viên quan trọng trong gia đình bạn và xứng đáng nhận được sự
              chăm sóc y tế tốt nhất.
            </p>
            <p className="text-gray-600 leading-relaxed">
              HustPetJoy cam kết mang lại chất lượng xuất sắc trong chăm sóc sức
              khỏe thú cưng. Chúng tôi không ngừng cải tiến dịch vụ, tích hợp
              các tiến bộ mới nhất trong y học thú y để nâng cao trải nghiệm và
              cung cấp sự chăm sóc vượt trội cho các bé. Dù bạn đang đặt lịch
              khám sức khỏe định kỳ hay cần điều trị cấp cứu, HustPetJoy luôn
              đồng hành cùng bạn.
            </p>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Tầm Nhìn Của Chúng Tôi
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tầm nhìn của chúng tôi tại HustPetJoy là tạo ra một trải nghiệm
                chăm sóc thú cưng liền mạch và toàn diện. Chúng tôi mong muốn
                trở thành cầu nối tin cậy giữa chủ nuôi và các chuyên gia thú y,
                giúp thú cưng của bạn nhận được sự chăm sóc tốt nhất mọi lúc mọi
                nơi.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            TẠI SAO <span className="text-blue-600">CHỌN CHÚNG TÔI</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="card p-8 hover:bg-blue-600 hover:text-white transition-all duration-300 animate-slide-up">
            <h3 className="text-xl font-bold mb-4">CHUYÊN NGHIỆP</h3>
            <p className="leading-relaxed">
              Đội ngũ bác sĩ thú y giàu kinh nghiệm với trang thiết bị y tế hiện
              đại, đảm bảo chất lượng điều trị tốt nhất.
            </p>
          </div>
          <div
            className="card p-8 hover:bg-blue-600 hover:text-white transition-all duration-300 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold mb-4">TIỆN LỢI</h3>
            <p className="leading-relaxed">
              Hệ thống đặt lịch hẹn trực tuyến nhanh chóng, phù hợp với lịch
              trình bận rộn của bạn.
            </p>
          </div>
          <div
            className="card p-8 hover:bg-blue-600 hover:text-white transition-all duration-300 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <h3 className="text-xl font-bold mb-4">TẬN TÂM</h3>
            <p className="leading-relaxed">
              Dịch vụ chăm sóc cá nhân hóa với sự quan tâm đặc biệt đến từng thú
              cưng và nhu cầu riêng biệt của chúng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
