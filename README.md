# Website Thuê Xe Du Lịch Tự Lái

Cài đặt:
 git clone https://github.com/NguyenB2207548/NLCS.git
 cd NLCS
 
Cấu hình Database:
  mysql -u root -p < Backend/models/scheme.sql
Dữ liệu mẫu:
  mysql -u root -p < Backend/models/data.sql
Lưu ý: 
  Sửa user, password, database trong file Backend/models/db.js (cấu hình kết nối MySQL)
  Nên tạo tài khoản mới để đăng nhập (không dùng tài khoản mẫu)
 
Chạy Backend:
  cd Backend
  npm install
  npm run dev
 Chạy Frontend:
  cd frontend
  npm install
  npm run dev
