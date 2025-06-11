import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";

const Rooms = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [pets, setPets] = useState([]);
  const { currencySymbol, backendUrl, userData, token } =
    useContext(AppContext);

  const fetchAvailableRooms = async () => {
    if (!startDate || !endDate) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/available-rooms`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          headers: { token },
        }
      );
      setRooms(data.availableRooms || []);
      setSelectedRoom(null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách phòng trống");
      setRooms([]);
      setSelectedRoom(null);
    }
  };

  const handleBooking = async () => {
    if (!selectedRoom || !selectedPet) {
      toast.error("Vui lòng chọn phòng và thú cưng");
      return;
    }

    try {
      const bookingData = {
        roomId: selectedRoom.id,
        petId: selectedPet.id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      };

      await axios.post(`${backendUrl}/api/user/book-room`, bookingData, {
        headers: { token },
      });
      toast.success("Đặt phòng thành công!");
      navigate("/my-rooms");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đặt phòng thất bại");
    }
  };

  useEffect(() => {
    if (userData?.pets) {
      setPets(userData.pets);
    }
  }, [userData]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAvailableRooms();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    console.log("Available rooms:", rooms);
    console.log("Selected room:", selectedRoom);
  }, [rooms, selectedRoom]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              🏠 Đặt Phòng Cho Thú Cưng
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Tìm không gian thoải mái và an toàn cho người bạn bốn chân yêu quý
              của bạn
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛡️</span>
                <span>An toàn tuyệt đối</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">❤️</span>
                <span>Chăm sóc tận tình</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span>Dịch vụ 5 sao</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          {/* Date Selection Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 transform transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📅</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Chọn Ngày Lưu Trú
                </h2>
                <p className="text-gray-600">
                  Chọn thời gian bạn muốn gửi thú cưng
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  📥 Ngày Nhận Thú Cưng
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="border-2 border-gray-200 rounded-xl p-4 w-full text-lg font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-blue-300"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="Chọn ngày nhận"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  📤 Ngày Trả Thú Cưng
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="border-2 border-gray-200 rounded-xl p-4 w-full text-lg font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-blue-300"
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  placeholderText="Chọn ngày trả"
                />
              </div>
            </div>
          </div>

          {/* Pet Selection Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 transform transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Chọn Thú Cưng
                </h2>
                <p className="text-gray-600">
                  Chọn thú cưng bạn muốn gửi lưu trú
                </p>
              </div>
            </div>

            {pets && pets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    className={`group relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                      selectedPet?.id === pet.id
                        ? "ring-4 ring-blue-500/50 border-blue-500 shadow-xl scale-105"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {selectedPet?.id === pet.id && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}

                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          pet.image ||
                          "https://via.placeholder.com/300x200?text=🐕+Ảnh+Thú+Cưng"
                        }
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-white to-gray-50">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        {pet.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                        <span className="text-lg">🏷️</span>
                        <span className="font-medium">Loài:</span> {pet.species}
                      </p>
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg">
                        <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
                          <span className="text-lg">📝</span>
                          <span>Ghi chú:</span>{" "}
                          {pet.note || "Không có ghi chú đặc biệt"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">🐕‍🦺</div>
                <p className="text-gray-600 mb-6 text-lg">
                  Bạn chưa có thú cưng nào. Hãy thêm thú cưng để tiếp tục!
                </p>
                <button
                  onClick={() => navigate("/add-pet")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
                >
                  ➕ Thêm Thú Cưng
                </button>
              </div>
            )}
          </div>

          {/* Room Selection Card */}
          {startDate && endDate && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 transform transition-all hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🏠</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Phòng Có Sẵn
                  </h2>
                  <p className="text-gray-600">
                    Chọn phòng phù hợp cho thú cưng của bạn
                  </p>
                </div>
              </div>

              {Array.isArray(rooms) && rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room, index) => (
                    <div
                      key={`room-${room.roomId}-${index}`}
                      onClick={() => {
                        console.log("Selected room:", room);
                        setSelectedRoom(room);
                      }}
                      className={`group relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        selectedRoom &&
                        selectedRoom.roomId === room.roomId &&
                        selectedRoom === room
                          ? "ring-4 ring-green-500/50 border-green-500 shadow-xl scale-105"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      {selectedRoom &&
                        selectedRoom.roomId === room.roomId &&
                        selectedRoom === room && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✓</span>
                            </div>
                          </div>
                        )}

                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            room.image ||
                            "https://via.placeholder.com/300x200?text=🏠+Phòng+Thú+Cưng"
                          }
                          alt={room.roomName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            {currencySymbol}
                            {room.totalPrice?.toLocaleString() || "0"}/ngày
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-2xl">🏠</span>
                          Phòng {room.roomName}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {room.description ||
                            "Phòng thoải mái với đầy đủ tiện nghi cho thú cưng"}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-lg">⭐</span>
                          <span>Phòng cao cấp • Tiện nghi đầy đủ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-gray-600 text-lg">
                    Không có phòng trống cho ngày đã chọn
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Vui lòng thử chọn ngày khác
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Booking Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                {selectedRoom && selectedPet ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📋</span>
                      </div>
                      <h3 className="text-2xl font-bold">Tóm Tắt Đặt Phòng</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐾</span>
                        <span className="font-medium">Thú cưng:</span>
                        <span className="text-white font-semibold">
                          {selectedPet.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏠</span>
                        <span className="font-medium">Phòng:</span>
                        <span className="text-white font-semibold">
                          {selectedRoom.roomName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="font-medium">Nhận:</span>
                        <span className="text-white font-semibold">
                          {startDate.toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="font-medium">Trả:</span>
                        <span className="text-white font-semibold">
                          {endDate.toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">
                          💰 Tổng Chi Phí:
                        </span>
                        <span className="text-3xl font-bold text-yellow-300">
                          {currencySymbol}
                          {(() => {
                            const start = new Date(
                              startDate.getFullYear(),
                              startDate.getMonth(),
                              startDate.getDate()
                            );
                            const end = new Date(
                              endDate.getFullYear(),
                              endDate.getMonth(),
                              endDate.getDate()
                            );
                            const diffTime = end.getTime() - start.getTime();
                            const days = Math.max(
                              1,
                              Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            );
                            return (
                              (
                                selectedRoom.totalPrice * days
                              )?.toLocaleString() || "0"
                            );
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-3">🤔</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Hãy Chọn Thú Cưng và Phòng
                    </h3>
                    <p className="text-blue-100">
                      Vui lòng chọn thú cưng và phòng để xem tóm tắt đặt phòng
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:ml-8">
                <button
                  onClick={handleBooking}
                  disabled={!selectedRoom || !selectedPet}
                  className={`group relative px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform ${
                    selectedRoom && selectedPet
                      ? "bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-xl hover:shadow-2xl"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    Đặt Phòng Ngay
                  </span>
                  {selectedRoom && selectedPet && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
