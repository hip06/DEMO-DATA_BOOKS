1. Mở Xampp => tạo mới database (bấm vào new ở sidebar bên trái) => dặt tên là book
2. Pull code về => npm i để tải thư viện
3. Mở terminal đứng tại demo-data-book: npx sequelize db:migrate
4. Mở file api.http => Bấm send request API insert (cái đầu tiên)
5. Lên phpMyAdmin check xem data đã có chưa?
6. API thứ 2 trong file api.http là để gọi lấy data (có hỗ trợ sort, filter, phân trang đầ đủ)