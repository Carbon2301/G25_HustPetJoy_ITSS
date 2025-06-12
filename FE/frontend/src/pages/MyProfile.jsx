import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  const {
    userId,
    token,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  } = useContext(AppContext);

  useEffect(() => {
    loadUserProfileData();
    setIsVisible(true);
  }, []);

  // Helper function to format date from backend to yyyy-MM-dd (without timezone issues)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      // If it's already in yyyy-MM-dd format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      // If it's ISO format, extract just the date part
      if (dateString.includes("T")) {
        return dateString.split("T")[0];
      }
      // For other formats, try to parse manually to avoid timezone issues
      if (dateString.includes("/")) {
        // Handle formats like MM/DD/YYYY or DD/MM/YYYY
        const parts = dateString.split("/");
        if (parts.length === 3) {
          // Assume DD/MM/YYYY format
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }
      // For other date strings, parse carefully to avoid timezone offset
      const date = new Date(dateString + "T00:00:00"); // Add time to avoid UTC interpretation
      if (isNaN(date.getTime())) {
        // If still invalid, try original parsing
        const fallbackDate = new Date(dateString);
        if (isNaN(fallbackDate.getTime())) {
          return "";
        }
        const year = fallbackDate.getFullYear();
        const month = String(fallbackDate.getMonth() + 1).padStart(2, "0");
        const day = String(fallbackDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Helper function to display gender in Vietnamese
  const getGenderDisplay = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
      case "nam":
        return "Nam";
      case "female":
      case "nu":
        return "Nữ";
      case "others":
      case "khac":
        return "Khác";
      default:
        return "Chưa chọn";
    }
  };

  // Function to update user profile data using API
  const updateUserProfileData = async () => {
    try {
      // Check if any pet has empty required fields
      if (userData.pets && userData.pets.length > 0) {
        const hasInvalidPets = userData.pets.some(
          (pet) => !pet.name || !pet.species || !pet.weight || !pet.health
        );
        if (hasInvalidPets) {
          toast.error("Vui lòng điền đầy đủ thông tin cho thú cưng của bạn");
          return;
        }
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("fullName", userData.fullName);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("sex", userData.sex);
      formData.append("dob", userData.dob);

      // Gửi JSON pets (nhớ giữ lại URL ảnh cũ nếu không chọn ảnh mới)
      formData.append(
        "pets",
        JSON.stringify(
          userData.pets.map((pet) => {
            const petData = { ...pet };
            // Nếu là File thì không cần gửi trong JSON
            if (pet.image instanceof File) {
              delete petData.image;
            }
            return petData;
          })
        )
      );

      // Gửi ảnh thật (nếu có) hoặc file rỗng để giữ đúng số lượng
      userData.pets.forEach((pet) => {
        if (pet.image instanceof File) {
          formData.append("petImages", pet.image);
        } else {
          // Gửi file rỗng để backend không ghi đè ảnh cũ
          formData.append(
            "petImages",
            new File([""], "empty.jpg", { type: "image/jpeg" })
          );
        }
      });

      // Gửi avatar nếu có
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addNewPet = () => {
    setUserData((prev) => ({
      ...prev,
      pets: [
        ...(prev.pets || []),
        {
          name: "",
          species: "",
          weight: "",
          health: "Good",
          image: "",
          note: "",
        },
      ],
    }));
  };

  return userData ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-8 transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hồ Sơ <span className="text-blue-600">Cá Nhân</span>
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin cá nhân và thú cưng của bạn
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information */}
          <div
            className={`lg:col-span-2 transform transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                {/* Avatar Section */}
                <div className="relative">
                  {isEdit ? (
                    <label htmlFor="image" className="cursor-pointer group">
                      <div className="relative">
                        <img
                          className="w-32 h-32 rounded-full object-cover shadow-lg group-hover:opacity-75 transition-opacity duration-300"
                          src={
                            image ? URL.createObjectURL(image) : userData.image
                          }
                          alt="Profile"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                      />
                    </label>
                  ) : (
                    <img
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                      src={userData.image}
                      alt="Profile"
                    />
                  )}

                  {/* Online Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                {/* Name and Status */}
                <div className="text-center md:text-left flex-1">
                  {isEdit ? (
                    <input
                      className="text-3xl font-bold text-gray-800 bg-gray-50 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      value={userData.fullName}
                      placeholder="Tên đầy đủ"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-gray-800">
                      {userData.fullName}
                    </h2>
                  )}
                  <p className="text-blue-600 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Thành viên HustPetJoy
                  </p>
                </div>

                {/* Edit Button */}
                <div>
                  {isEdit ? (
                    <div className="flex gap-3">
                      <button
                        onClick={updateUserProfileData}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Lưu
                      </button>
                      <button
                        onClick={() => setIsEdit(false)}
                        className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors duration-300 font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEdit(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>

              {/* Information Sections */}
              <div className="space-y-8">
                {/* Contact Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Thông Tin Liên Hệ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center gap-2 text-blue-600">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        {userData.email}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      {isEdit ? (
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="text"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          value={userData.phone}
                          placeholder="Số điện thoại"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {userData.phone || "Chưa cập nhật"}
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-4 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      {isEdit ? (
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="text"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          value={userData.address}
                          placeholder="Địa chỉ"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {userData.address || "Chưa cập nhật"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Thông Tin Cơ Bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                      </label>
                      {isEdit ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              sex: e.target.value,
                            }))
                          }
                          value={userData.sex || ""}
                        >
                          <option value="">Chưa chọn</option>
                          <option value="Male">Nam</option>
                          <option value="Female">Nữ</option>
                          <option value="Others">Khác</option>
                        </select>
                      ) : (
                        <p className="text-gray-700">
                          {getGenderDisplay(userData.sex)}
                        </p>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      {isEdit ? (
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="date"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              dob: e.target.value,
                            }))
                          }
                          value={formatDateForInput(userData.dob)}
                        />
                      ) : (
                        <p className="text-gray-700">
                          {formatDateForInput(userData.dob) || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pets Information */}
          <div
            className={`transform transition-all duration-700 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🐾</span>
                  Thú Cưng Của Tôi
                </h3>
                {isEdit && (
                  <button
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    onClick={addNewPet}
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Thêm
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(!userData.pets || userData.pets.length === 0) && !isEdit && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🐕</div>
                    <p className="text-gray-500 mb-4">Chưa có thú cưng nào</p>
                    <p className="text-sm text-gray-400">
                      Hãy thêm thông tin thú cưng của bạn
                    </p>
                  </div>
                )}

                {userData.pets &&
                  userData.pets.map((pet, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                    >
                      {isEdit ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold text-gray-800">
                              Thú cưng #{index + 1}
                            </h4>
                            <button
                              className="text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center gap-1"
                              onClick={() => {
                                const newPets = userData.pets.filter(
                                  (_, i) => i !== index
                                );
                                setUserData((prev) => ({
                                  ...prev,
                                  pets: newPets,
                                }));
                              }}
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Xóa
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên <span className="text-red-500">*</span>
                              </label>
                              <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Tên thú cưng"
                                value={pet.name || ""}
                                onChange={(e) => {
                                  const newPets = [...userData.pets];
                                  newPets[index] = {
                                    ...newPets[index],
                                    name: e.target.value,
                                  };
                                  setUserData((prev) => ({
                                    ...prev,
                                    pets: newPets,
                                  }));
                                }}
                              />
                              {pet.name === "" && (
                                <p className="text-xs text-red-500 mt-1">
                                  Tên là bắt buộc
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Loài <span className="text-red-500">*</span>
                                </label>
                                <input
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  type="text"
                                  placeholder="Chó, Mèo..."
                                  value={pet.species || ""}
                                  onChange={(e) => {
                                    const newPets = [...userData.pets];
                                    newPets[index] = {
                                      ...newPets[index],
                                      species: e.target.value,
                                    };
                                    setUserData((prev) => ({
                                      ...prev,
                                      pets: newPets,
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Cân nặng (kg){" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  type="text"
                                  placeholder="5.2"
                                  value={pet.weight || ""}
                                  onChange={(e) => {
                                    const newPets = [...userData.pets];
                                    newPets[index] = {
                                      ...newPets[index],
                                      weight: e.target.value,
                                    };
                                    setUserData((prev) => ({
                                      ...prev,
                                      pets: newPets,
                                    }));
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tình trạng sức khỏe{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={pet.health || "Good"}
                                onChange={(e) => {
                                  const newPets = [...userData.pets];
                                  newPets[index] = {
                                    ...newPets[index],
                                    health: e.target.value,
                                  };
                                  setUserData((prev) => ({
                                    ...prev,
                                    pets: newPets,
                                  }));
                                }}
                              >
                                <option value="Excellent">Xuất sắc</option>
                                <option value="Good">Tốt</option>
                                <option value="Fair">Khá</option>
                                <option value="Poor">Yếu</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Ghi chú về thú cưng (tính cách, thói quen, sở thích...)"
                                rows="3"
                                value={pet.note || ""}
                                onChange={(e) => {
                                  const newPets = [...userData.pets];
                                  newPets[index] = {
                                    ...newPets[index],
                                    note: e.target.value,
                                  };
                                  setUserData((prev) => ({
                                    ...prev,
                                    pets: newPets,
                                  }));
                                }}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh
                              </label>
                              <div className="flex items-center gap-3">
                                <label className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2">
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
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                  </svg>
                                  Chọn ảnh
                                  <input
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const newPets = [...userData.pets];
                                        newPets[index] = {
                                          ...newPets[index],
                                          image: file,
                                        };
                                        setUserData((prev) => ({
                                          ...prev,
                                          pets: newPets,
                                        }));
                                      }
                                    }}
                                  />
                                </label>
                                {pet.image && (
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={
                                        pet.image instanceof File
                                          ? URL.createObjectURL(pet.image)
                                          : pet.image
                                      }
                                      alt="Preview"
                                      className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <button
                                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                      onClick={() => {
                                        const newPets = [...userData.pets];
                                        newPets[index] = {
                                          ...newPets[index],
                                          image: "",
                                        };
                                        setUserData((prev) => ({
                                          ...prev,
                                          pets: newPets,
                                        }));
                                      }}
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              className="w-full h-full object-cover rounded-xl shadow-md"
                              src={
                                pet.image ||
                                "https://via.placeholder.com/100?text=🐾"
                              }
                              alt={pet.name}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800 mb-1">
                              {pet.name}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <span className="text-blue-600">🐕</span>
                                Loài:{" "}
                                <span className="font-medium">
                                  {pet.species}
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-green-600">⚖️</span>
                                Cân nặng:{" "}
                                <span className="font-medium">
                                  {pet.weight} kg
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span
                                  className={`${
                                    pet.health === "Excellent"
                                      ? "text-green-500"
                                      : pet.health === "Good"
                                      ? "text-blue-500"
                                      : pet.health === "Fair"
                                      ? "text-yellow-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  💖
                                </span>
                                Sức khỏe:{" "}
                                <span className="font-medium">
                                  {pet.health === "Excellent"
                                    ? "Xuất sắc"
                                    : pet.health === "Good"
                                    ? "Tốt"
                                    : pet.health === "Fair"
                                    ? "Khá"
                                    : "Yếu"}
                                </span>
                              </p>
                              {pet.note && (
                                <div className="mt-2">
                                  <p className="flex items-start gap-2">
                                    <span className="text-purple-600 mt-0.5">
                                      📝
                                    </span>
                                    <div>
                                      <span className="font-medium text-gray-700">
                                        Ghi chú:
                                      </span>
                                      <span className="block text-gray-600 mt-1 text-sm leading-relaxed">
                                        {pet.note}
                                      </span>
                                    </div>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MyProfile;
