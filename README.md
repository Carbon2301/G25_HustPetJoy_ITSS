# Hust Pet Joy Management

## Giới Thiệu

Dự án **Hệ thống quản lý chăm sóc thú cưng** là một ứng dụng toàn diện quản lý các hoạt động của trung tâm chăm sóc thú cưng, được xây dựng dựa trên các nguyên lý của lập trình hướng đối tượng (OOP) và kiến trúc microservices. Hệ thống hỗ trợ quản lý thông tin thú cưng, khách hàng, bác sĩ thú y, lịch hẹn, điều trị, thuốc, dịch vụ spa, phòng lưu trú và hóa đơn, giúp nâng cao hiệu quả quản lý và mang lại trải nghiệm tốt nhất cho thú cưng.

## Các Tính Năng Chính

### 🐾 **Quản lý thú cưng**
- Thêm, sửa, tìm kiếm thông tin thú cưng
- Theo dõi lịch sử sức khỏe và điều trị
- Quản lý hồ sơ y tế điện tử

### 👥 **Quản lý khách hàng**
- Đăng ký, cập nhật thông tin khách hàng
- Quản lý danh sách thú cưng của từng khách hàng
- Lịch sử sử dụng dịch vụ

### 👨‍⚕️ **Quản lý bác sĩ và nhân viên**
- Thêm, sửa, phân quyền vai trò
- Quản lý lịch làm việc và chuyên môn
- Dashboard riêng cho từng vai trò

### 📅 **Quản lý lịch hẹn**
- Đặt lịch khám bệnh, spa, lưu trú
- Theo dõi trạng thái lịch hẹn
- Hủy và điều chỉnh lịch hẹn
- Thông báo nhắc nhở tự động

### 🏥 **Quản lý điều trị**
- Tạo và theo dõi phác đồ điều trị
- Quản lý đơn thuốc và toa thuốc
- Lưu trữ kết quả xét nghiệm
- Quản lý kho thuốc và vật tư y tế

### 🏨 **Quản lý phòng lưu trú**
- Đặt phòng cho thú cưng
- Theo dõi tình trạng phòng và thông báo tình trạng của thú cưng liên tục
- Quản lý dịch vụ chăm sóc đặc biệt

### 💆‍♀️ **Dịch vụ Spa**
- Đặt lịch các dịch vụ làm đẹp
- Quản lý gói dịch vụ spa
- Theo dõi lịch sử sử dụng


### 💰 **Quản lý hóa đơn**
- Lập hóa đơn tự động
- Tích hợp thanh toán đa dạng
- Báo cáo doanh thu và thống kê

## Công Nghệ Sử Dụng

- **Backend**: Spring Boot 3.3.4
- **Database**: SQL Server
- **Frontend**: React.js + Vite
- **UI Framework**: Tailwind CSS
- **File Storage**: AWS S3
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Deployment**: Vercel
- **Khác**: Docker, Maven

## Yêu Cầu Hệ Thống

- **Java**: Phiên bản 17 hoặc cao hơn
- **Node.js**: Phiên bản 18 hoặc cao hơn
- **Maven**: Phiên bản 3.8+
- **SQL Server**: 2019 hoặc cao hơn
- **Docker**: (Optional) để chạy database

## Hướng Dẫn Cài Đặt và Chạy Dự Án

### 1. Clone Repository
```bash
git clone https://github.com/KhaiLe190904/G25_HustPetJoy_ITSS
cd G25_HustPetJoy_ITSS
```

### 2. Thiết lập Database
#### Bước 1: Sử dụng Docker (Khuyến nghị)
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=HustPetJoy@20242" -p 1444:1433 --name hust_pet_joy_db --hostname hust_pet_joy_db -d mcr.microsoft.com/mssql/server:2019-latest
```

#### Bước 2: Cài đặt SQL Server thủ công
- Tải và cài đặt SQL Server
- Tạo database mới với tên `hust_pet_joy`
- Import file `sql/petjoy.sql` vào database hoặc copy code bên trong file petjoy.sql vào **New Query** trong **SQL Server**

### 3. Cấu hình Backend
```bash
cd BE
# Cập nhật thông tin database trong src/main/resources/application.properties
# spring.datasource.url=jdbc:sqlserver://localhost:1444;databaseName=hust_pet_joy;encrypt=false;trustServerCertificate=true;
# spring.datasource.username=sa
# spring.datasource.password=HustPetJoy@20242
```

### 4. Chạy Backend
```bash
# Trong thư mục BE
# ./mvnw spring-boot:run
Hoặc sử dụng IDE (IntelliJ IDEA, Eclipse) **Khuyến khích dùng**
```

### 5. Cài đặt và chạy Frontend

#### Admin Panel
```bash
cd FE/admin
npm install
npm run dev
# Admin panel sẽ chạy tại http://localhost:5173
```

#### User Frontend
```bash
cd FE/frontend
npm install
npm run dev
# Frontend sẽ chạy tại http://localhost:5174
```

## Cấu Trúc Dự Án

```
Hust_Pet_Joy_Management/
├── BE/                                 # Backend Spring Boot
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/                 # REST Controllers
│   │   ├── service/                    # Business Logic
│   │   ├── repository/                 # Data Access Layer
│   │   ├── model/                      # Entity Classes
│   │   ├── dto/                        # Data Transfer Objects
│   │   └── config/                     # Configuration
│   ├── sql/                           # Database Scripts
│   └── pom.xml                        # Maven Dependencies
├── FE/
│   ├── admin/                         # Admin Panel React App
│   │   ├── src/
│   │   │   ├── components/            # Reusable Components
│   │   │   ├── pages/                 # Page Components
│   │   │   ├── context/               # Context API
│   │   │   └── assets/                # Static Files
│   │   └── package.json
│   └── frontend/                      # User Frontend React App
│       ├── src/
│       │   ├── components/            # Reusable Components
│       │   ├── pages/                 # Page Components
│       │   ├── hooks/                 # Custom Hooks
│       │   ├── context/               # Context API
│       │   └── assets/                # Static Files
│       └── package.json
└── README.md
```

## API Documentation

Sau khi chạy backend, có thể truy cập Swagger UI tại:
```
http://localhost:8080/swagger-ui/index.html
```

## Các Cổng Mặc Định

- **Backend API**: http://localhost:8080
- **Admin Panel**: http://localhost:5173
- **User Frontend**: http://localhost:5174
- **Database**: localhost:1433

## Tài Khoản Mặc Định

### Admin
- **Username**: admin@gmail.com
- **Password**: admin

### Doctor
- **Username**: tuan@gmail.com
- **Password**: tuan

### Employee
- **Username**: dong@gmail.com
- **Password**: dong

### User
- **Username**: khai@gmail.com
- **Password**: khai

## Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Liên Hệ

- **Email**: lequangkhai190904@gmail.com
- **Facebook** : Trong my profile của tôi


**Lưu ý**: Đây là dự án học tập, vui lòng hãy liên hệ để giải đáp thắc mắc và không sử dụng trong môi trường production mà chưa qua kiểm thử kỹ lưỡng.
