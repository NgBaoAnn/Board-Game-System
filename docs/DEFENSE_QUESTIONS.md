# BỘ CÂU HỎI BẢO VỆ ĐỒ ÁN - BOARD GAME SYSTEM

**Dự án:** Board Game System  
**Stack:** ReactJS + Express.js + Knex + Supabase (PostgreSQL)  
**Số lượng câu hỏi:** 45 câu

---

## PHẦN 1: CÂU HỎI TỔNG QUAN

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 1 | "Hệ thống này giải quyết vấn đề gì? Nếu không có app này thì người dùng làm thế nào?" | Dễ | Hiểu mục tiêu thực sự của dự án |
| 2 | "Ai là người dùng chính của ứng dụng? Họ có nhu cầu gì?" | Dễ | Xác định đối tượng và use case |
| 3 | "Phạm vi đồ án của em đến đâu? Có gì em chưa làm được?" | Dễ | Đánh giá khả năng nhận thức giới hạn |
| 4 | "So với các ứng dụng game online khác, điểm khác biệt của app em là gì?" | Trung bình | Tư duy phân tích cạnh tranh |
| 5 | "Nếu có thêm 1 tuần nữa, em sẽ làm thêm tính năng gì?" | Dễ | Đánh giá tầm nhìn phát triển |

---

## PHẦN 2: CÂU HỎI VỀ CÔNG NGHỆ

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 6 | "Tại sao em chọn ReactJS mà không phải Vue hoặc Angular?" | Trung bình | Hiểu về lựa chọn framework |
| 7 | "Express.js có điểm gì hơn NestJS hay Fastify?" | Trung bình | So sánh backend framework |
| 8 | "Tại sao dùng Supabase? Có thể dùng Firebase được không?" | Trung bình | Hiểu về BaaS và trade-off |
| 9 | "Em dùng Knex làm gì? Sao không dùng Prisma hay Sequelize?" | Trung bình | Hiểu về ORM/Query builder |
| 10 | "Ant Design có ưu điểm gì so với Material UI hay Chakra UI?" | Dễ | Lý do chọn UI library |
| 11 | "Vite khác gì với Create React App? Tại sao em chọn Vite?" | Trung bình | Hiểu về build tool |
| 12 | "Em có biết nhược điểm lớn nhất của stack em đang dùng là gì không?" | Khó | Tư duy phản biện về công nghệ |

---

## PHẦN 3: CÂU HỎI VỀ KIẾN TRÚC HỆ THỐNG

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 13 | "Em giải thích kiến trúc tổng thể của hệ thống đi?" | Dễ | Có nắm được big picture không |
| 14 | "Request từ người dùng đi qua những layer nào trước khi tới database?" | Trung bình | Hiểu data flow và phân tầng |
| 15 | "Controller khác gì Service? Tại sao phải tách ra?" | Trung bình | Hiểu separation of concerns |
| 16 | "Repository layer làm nhiệm vụ gì? Bỏ nó đi được không?" | Khó | Hiểu về abstraction layer |
| 17 | "Frontend quản lý state bằng gì? Zustand hay Context API?" | Trung bình | Hiểu state management |
| 18 | "Làm sao frontend biết user đã đăng nhập hay chưa sau khi refresh trang?" | Trung bình | Hiểu auth flow và persistence |
| 19 | "API của em theo chuẩn gì? RESTful tuân thủ đến mức nào?" | Trung bình | Hiểu REST conventions |
| 20 | "Em có bao nhiêu route? Cách đặt tên route của em theo quy tắc gì?" | Dễ | Nhận thức về API design |

---

## PHẦN 4: DATABASE & DATA FLOW

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 21 | "Database có bao nhiêu bảng? Kể tên 5 bảng quan trọng nhất?" | Dễ | Nhớ cấu trúc DB của mình |
| 22 | "Bảng users và bảng friends quan hệ với nhau như thế nào?" | Trung bình | Hiểu relationship |
| 23 | "Tại sao em cần bảng game_sessions? Không lưu trực tiếp vào users được à?" | Trung bình | Hiểu về normalization |
| 24 | "Giải thích flow khi user nhấn 'Save Game' - dữ liệu đi như thế nào?" | Trung bình | Hiểu end-to-end flow |
| 25 | "Bảng achievements có trigger tự động. Em giải thích trigger đó hoạt động thế nào?" | Khó | Hiểu database trigger |
| 26 | "Migration là gì? Tại sao cần migration thay vì sửa database trực tiếp?" | Trung bình | Hiểu về DB versioning |
| 27 | "Em có dùng index không? Đánh index ở đâu, tại sao?" | Khó | Hiểu optimization |
| 28 | "Nếu 1 user có 10,000 game sessions, query có chậm không? Làm sao optimize?" | Khó | Tư duy scalability |

---

## PHẦN 5: BẢO MẬT & HIỆU NĂNG

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 29 | "Em dùng gì để xác thực người dùng? Giải thích JWT hoạt động?" | Trung bình | Hiểu authentication |
| 30 | "Access token khác refresh token thế nào? Tại sao cần cả hai?" | Khó | Hiểu sâu về JWT strategy |
| 31 | "Làm sao phân biệt user thường và admin trong hệ thống?" | Dễ | Hiểu authorization |
| 32 | "Nếu em quên check quyền ở 1 API, hậu quả là gì?" | Trung bình | Nhận thức về security risk |
| 33 | "Password được lưu như thế nào? Bcrypt là gì?" | Trung bình | Hiểu password hashing |
| 34 | "Có validate dữ liệu ở frontend không? Ở backend không? Cần cả hai không?" | Trung bình | Hiểu về input validation |
| 35 | "API có trả về lỗi chi tiết không? Có risk gì khi trả về quá nhiều thông tin?" | Khó | Nhận thức về information disclosure |
| 36 | "Em có dùng lazy loading không? Ở đâu?" | Trung bình | Hiểu optimization FE |
| 37 | "Nếu có 1000 người chơi cùng lúc, backend có đáp ứng được không?" | Khó | Tư duy về load |

---

## PHẦN 6: TRIỂN KHAI & VẬN HÀNH

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 38 | "Hướng dẫn thầy cách chạy project trên máy mới?" | Dễ | Biết setup project |
| 39 | "File .env chứa gì? Tại sao không push lên git?" | Dễ | Hiểu về environment config |
| 40 | "Khác biệt giữa môi trường development và production?" | Trung bình | Hiểu về deployment |
| 41 | "Em đã deploy ở đâu chưa? Dùng service gì?" | Dễ | Kinh nghiệm deployment |
| 42 | "Nếu app bị lỗi trên production, làm sao em biết?" | Khó | Hiểu về logging/monitoring |

---

## PHẦN 7: CÂU HỎI "GÀI BẪY" / ĐÀO SÂU

| # | Câu hỏi | Độ khó | Mục đích kiểm tra |
|:-:|---------|:------:|-------------------|
| 43 | "Nếu thầy tắt database, app của em báo lỗi thế nào cho user?" | Khó | Error handling thực tế |
| 44 | "User A gửi request lưu game, chưa xong thì refresh trang. Chuyện gì xảy ra?" | Khó | Hiểu về race condition |
| 45 | "Em có viết unit test không? Nếu không, tại sao?" | Trung bình | Nhận thức về testing |
| 46 | "Code này em tự viết hay copy từ đâu? Giải thích đoạn này cho thầy?" | Khó | Kiểm tra có hiểu code không |
| 47 | "Nếu có triệu user, database design hiện tại có scale được không?" | Khó | Tư duy về scalability |
| 48 | "Thầy thấy em dùng useCallback và useMemo. Em giải thích tại sao dùng?" | Trung bình | Hiểu về React optimization |
| 49 | "Nếu user mở 2 tab và chơi cùng lúc, có conflict không?" | Khó | Tư duy về concurrency |
| 50 | "Socket.io để làm gì? Sao không dùng polling thường?" | Trung bình | Hiểu về realtime (nếu có dùng) |

---

## THỐNG KÊ

| Độ khó | Số lượng | Tỷ lệ |
|:------:|:--------:|:-----:|
| Dễ | 12 | 24% |
| Trung bình | 24 | 48% |
| Khó | 14 | 28% |

---

## GỢI Ý CHUẨN BỊ

### ✅ Những điều nên chuẩn bị:
1. **Vẽ sơ đồ kiến trúc** - có sẵn để trình bày
2. **Nhớ số liệu** - bao nhiêu bảng, bao nhiêu API, bao nhiêu component
3. **Hiểu flow chính** - từ click button đến database và ngược lại
4. **Biết điểm yếu** - thầy hay hỏi "em thấy cái gì chưa tốt"
5. **Chuẩn bị demo backup** - phòng trường hợp live demo fail

### ⚠️ Những câu hỏi "bẫy" thường gặp:
- "Đoạn code này em copy từ đâu?" → Phải hiểu code mình viết
- "Tại sao không dùng X thay vì Y?" → Phải có lý do, không nói "vì quen"
- "Nếu scale lên thì sao?" → Phải có suy nghĩ về tương lai
- "Em làm bao lâu? Một mình hay nhóm?" → Phải trung thực

---

*Tài liệu được tạo dựa trên phân tích source code Board Game System*  
*Ngày tạo: 19/01/2026*
