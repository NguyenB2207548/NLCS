# Website Thuê Xe Du Lịch Tự Lái

## 1.Cài đặt source code:
```bash
 git clone https://github.com/NguyenB2207548/NLCS.git
 cd NLCS
```
## 2.Cấu hình Database
```bash
  mysql -u root -p < Backend/models/scheme.sql
```
## 3.Dữ liệu mẫu:
```bash
  mysql -u root -p < Backend/models/data.sql
``
## Lưu ý: 
  - Sửa user, password, database trong file Backend/models/db.js (cấu hình kết nối MySQL)
  - Nên tạo tài khoản mới để đăng nhập (không dùng tài khoản mẫu)
 
## 4.Chạy Backend:
```bash
  cd Backend
  npm install
  npm run dev
```
## 5.Chạy Frontend:
```bash
  cd frontend
  npm install
  npm run dev
```


