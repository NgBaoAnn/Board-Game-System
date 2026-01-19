# TÀI LIỆU USE CASE - HỆ THỐNG BOARD GAME

**Tên dự án:** Board Game System  
**Phiên bản:** 1.0  
**Ngày tạo:** 19/01/2026  

---

## PHẦN 1: TỔNG QUAN HỆ THỐNG

### 1.1. Tên hệ thống
**Board Game System** - Hệ thống chơi Board Game trực tuyến

### 1.2. Mô tả ngắn gọn
Board Game System là ứng dụng web cho phép người dùng chơi các trò chơi bàn cổ điển (Caro, Tic-tac-toe, Snake, Match-3, Memory, Free Draw), kết bạn, nhắn tin, xem xếp hạng, mở khóa thành tựu và đánh giá game. Hệ thống hỗ trợ 2 loại người dùng: Người chơi thông thường và Quản trị viên.

### 1.3. Các Actor trong hệ thống

| STT | Actor | Mô tả |
|:---:|-------|-------|
| 1 | **Guest (Khách)** | Người chưa đăng nhập, chỉ có thể xem trang chủ và đăng ký/đăng nhập |
| 2 | **User (Người chơi)** | Người đã đăng nhập, có thể chơi game, kết bạn, nhắn tin, xem xếp hạng |
| 3 | **Admin (Quản trị viên)** | Quản lý hệ thống: người dùng, game, thành tựu, thống kê |

---

## PHẦN 2: DANH SÁCH ACTOR CHI TIẾT

### 2.1. Guest (Khách)

| Thuộc tính | Mô tả |
|------------|-------|
| **Định nghĩa** | Người truy cập hệ thống nhưng chưa đăng nhập |
| **Quyền hạn** | Xem trang chủ, đăng ký tài khoản, đăng nhập, quên mật khẩu, xem review game công khai |
| **Hạn chế** | Không thể chơi game, không xem xếp hạng chi tiết, không kết bạn/nhắn tin |

### 2.2. User (Người chơi)

| Thuộc tính | Mô tả |
|------------|-------|
| **Định nghĩa** | Người dùng đã đăng ký và đăng nhập thành công |
| **Quyền hạn** | Chơi 7 loại game, lưu/tiếp tục game, kết bạn, nhắn tin, xem xếp hạng, mở khóa thành tựu, đánh giá game, cập nhật hồ sơ cá nhân |
| **Hạn chế** | Không có quyền quản trị hệ thống |

### 2.3. Admin (Quản trị viên)

| Thuộc tính | Mô tả |
|------------|-------|
| **Định nghĩa** | Quản trị viên có toàn quyền quản lý hệ thống |
| **Quyền hạn** | Toàn bộ quyền của User + Quản lý người dùng, quản lý game, quản lý thành tựu, xem dashboard thống kê |
| **Hạn chế** | Không có |

---

## PHẦN 3: BẢNG DANH SÁCH USE CASE

| ID | Tên Use Case | Actor | Mô tả ngắn |
|:--:|--------------|-------|------------|
| UC-01 | Đăng ký tài khoản | Guest | Tạo tài khoản mới để tham gia hệ thống |
| UC-02 | Đăng nhập | Guest | Xác thực để vào hệ thống |
| UC-03 | Đăng xuất | User, Admin | Thoát khỏi phiên đăng nhập |
| UC-04 | Quên mật khẩu | Guest | Khôi phục mật khẩu qua OTP email |
| UC-05 | Xem/Cập nhật hồ sơ cá nhân | User, Admin | Quản lý thông tin cá nhân |
| UC-06 | Chọn game để chơi | User | Lựa chọn game từ danh sách 7 game |
| UC-07 | Bắt đầu game mới | User | Khởi tạo ván game mới với thời gian tùy chọn |
| UC-08 | Tiếp tục game đã lưu | User | Tải và chơi tiếp game đã lưu trước đó |
| UC-09 | Chơi game | User | Thực hiện các thao tác trong game |
| UC-10 | Tạm dừng/Tiếp tục game | User | Tạm ngừng và tiếp tục ván game đang chơi |
| UC-11 | Lưu game | User | Lưu trạng thái game hiện tại để chơi sau |
| UC-12 | Kết thúc game | User | Hoàn thành ván game và nhận điểm |
| UC-13 | Chuyển đổi game | User | Chuyển sang game khác khi đang chơi |
| UC-14 | Gửi yêu cầu kết bạn | User | Gửi lời mời kết bạn đến người chơi khác |
| UC-15 | Xử lý yêu cầu kết bạn | User | Chấp nhận/Từ chối lời mời kết bạn |
| UC-16 | Xem danh sách bạn bè | User | Hiển thị danh sách bạn bè hiện tại |
| UC-17 | Hủy kết bạn | User | Xóa một người khỏi danh sách bạn bè |
| UC-18 | Tìm kiếm người chơi | User | Tìm người chơi trong cộng đồng |
| UC-19 | Xem hồ sơ người chơi khác | User | Xem thông tin công khai của người chơi |
| UC-20 | Gửi tin nhắn | User | Gửi tin nhắn văn bản/file cho bạn bè |
| UC-21 | Xem hộp thư | User | Xem danh sách cuộc hội thoại |
| UC-22 | React tin nhắn | User | Thêm reaction vào tin nhắn |
| UC-23 | Xem xếp hạng hệ thống | User | Xem bảng xếp hạng toàn hệ thống theo game |
| UC-24 | Xem xếp hạng bạn bè | User | Xem bảng xếp hạng trong nhóm bạn bè |
| UC-25 | Xem thành tựu cá nhân | User | Xem các thành tựu đã mở khóa |
| UC-26 | Xem danh sách review game | User, Guest | Xem đánh giá của người chơi về game |
| UC-27 | Viết review game | User | Đánh giá và bình luận về game |
| UC-28 | Xóa review | User | Xóa đánh giá của mình |
| UC-29 | Quản lý người dùng | Admin | CRUD tài khoản người dùng |
| UC-30 | Vô hiệu hóa/Kích hoạt tài khoản | Admin | Enable/Disable tài khoản người dùng |
| UC-31 | Quản lý game | Admin | CRUD danh sách game trong hệ thống |
| UC-32 | Quản lý thành tựu | Admin | CRUD thành tựu cho các game |
| UC-33 | Xem Dashboard thống kê | Admin | Xem biểu đồ thống kê hệ thống |
| UC-34 | Thay đổi theme giao diện | User, Admin | Chuyển đổi Dark/Light mode |

---

## PHẦN 4: ĐẶC TẢ CHI TIẾT CÁC USE CASE

---

### UC-01: Đăng ký tài khoản

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-01 |
| **Tên Use Case** | Đăng ký tài khoản |
| **Actor** | Guest |
| **Mô tả** | Cho phép người dùng mới tạo tài khoản để tham gia hệ thống |
| **Điều kiện tiên quyết** | - Người dùng chưa có tài khoản<br>- Người dùng đang ở trang đăng ký |
| **Điều kiện sau** | - Tài khoản mới được tạo trong database<br>- Người dùng được chuyển đến trang đăng nhập |

**Luồng chính (Main Flow):**
1. Guest truy cập trang Đăng ký (`/register`)
2. Hệ thống hiển thị form đăng ký với các trường: Username, Email, Password, Confirm Password
3. Guest nhập thông tin vào form
4. Guest nhấn nút "Đăng ký"
5. Hệ thống validate dữ liệu đầu vào
6. Hệ thống kiểm tra email/username chưa tồn tại
7. Hệ thống mã hóa mật khẩu và tạo tài khoản mới
8. Hệ thống hiển thị thông báo đăng ký thành công
9. Hệ thống chuyển hướng đến trang đăng nhập

**Luồng thay thế/ngoại lệ:**

| Bước | Điều kiện | Xử lý |
|:----:|-----------|-------|
| 5a | Dữ liệu không hợp lệ (email sai format, password yếu) | Hiển thị thông báo lỗi cụ thể, không submit form |
| 6a | Email hoặc Username đã tồn tại | Hiển thị lỗi "Email/Username đã được sử dụng" |
| 7a | Lỗi kết nối database | Hiển thị thông báo lỗi hệ thống |

---

### UC-02: Đăng nhập

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-02 |
| **Tên Use Case** | Đăng nhập |
| **Actor** | Guest |
| **Mô tả** | Xác thực người dùng để truy cập hệ thống |
| **Điều kiện tiên quyết** | - Người dùng đã có tài khoản<br>- Tài khoản ở trạng thái active |
| **Điều kiện sau** | - Người dùng được xác thực<br>- JWT token được tạo và lưu trữ<br>- Chuyển hướng theo role |

**Luồng chính (Main Flow):**
1. Guest truy cập trang Đăng nhập (`/login`)
2. Hệ thống hiển thị form đăng nhập với Email và Password
3. Guest nhập thông tin xác thực
4. Guest nhấn nút "Đăng nhập"
5. Hệ thống validate dữ liệu
6. Hệ thống xác thực email và password với database
7. Hệ thống tạo JWT token (access token + refresh token)
8. Hệ thống lưu token vào localStorage
9. Nếu role = 'admin': Chuyển đến `/admin/dashboard`
10. Nếu role = 'user': Chuyển đến `/` (Homepage)

**Luồng thay thế/ngoại lệ:**

| Bước | Điều kiện | Xử lý |
|:----:|-----------|-------|
| 6a | Email không tồn tại | Hiển thị "Email hoặc mật khẩu không đúng" |
| 6b | Mật khẩu sai | Hiển thị "Email hoặc mật khẩu không đúng" |
| 6c | Tài khoản bị vô hiệu hóa | Hiển thị "Tài khoản đã bị khóa, vui lòng liên hệ admin" |

---

### UC-03: Đăng xuất

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-03 |
| **Tên Use Case** | Đăng xuất |
| **Actor** | User, Admin |
| **Mô tả** | Kết thúc phiên đăng nhập hiện tại |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập |
| **Điều kiện sau** | - Token bị xóa<br>- Chuyển về trang đăng nhập |

**Luồng chính (Main Flow):**
1. Người dùng click vào nút "Đăng xuất" (trên Navbar/Sidebar)
2. Hệ thống gọi API logout
3. Hệ thống xóa token khỏi localStorage
4. Hệ thống reset trạng thái xác thực
5. Hệ thống chuyển hướng đến `/login`

---

### UC-04: Quên mật khẩu

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-04 |
| **Tên Use Case** | Quên mật khẩu |
| **Actor** | Guest |
| **Mô tả** | Khôi phục mật khẩu thông qua xác thực OTP gửi qua email |
| **Điều kiện tiên quyết** | - Người dùng đã có tài khoản với email hợp lệ |
| **Điều kiện sau** | - Mật khẩu được cập nhật thành công |

**Luồng chính (Main Flow):**
1. Guest truy cập `/forgot-password`
2. Guest nhập email đã đăng ký
3. Guest nhấn "Gửi OTP"
4. Hệ thống kiểm tra email tồn tại
5. Hệ thống tạo OTP và gửi qua email
6. Hệ thống chuyển đến trang Verify OTP (`/verify-otp`)
7. Guest nhập mã OTP nhận được
8. Hệ thống xác thực OTP
9. Hệ thống chuyển đến trang Reset Password (`/reset-password`)
10. Guest nhập mật khẩu mới và xác nhận
11. Hệ thống cập nhật mật khẩu
12. Hệ thống chuyển đến trang đăng nhập

**Luồng thay thế/ngoại lệ:**

| Bước | Điều kiện | Xử lý |
|:----:|-----------|-------|
| 4a | Email không tồn tại | Hiển thị lỗi "Email không tồn tại trong hệ thống" |
| 8a | OTP sai hoặc hết hạn | Hiển thị lỗi "OTP không hợp lệ hoặc đã hết hạn" |

---

### UC-05: Xem/Cập nhật hồ sơ cá nhân

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-05 |
| **Tên Use Case** | Xem/Cập nhật hồ sơ cá nhân |
| **Actor** | User, Admin |
| **Mô tả** | Xem và chỉnh sửa thông tin cá nhân của người dùng |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập |
| **Điều kiện sau** | Thông tin được cập nhật trong database |

**Luồng chính (Main Flow):**
1. Người dùng truy cập `/profile`
2. Hệ thống hiển thị thông tin hồ sơ với các tab: Profile, Friends, Achievements, Game History
3. Người dùng chọn tab "Edit Profile"
4. Hệ thống hiển thị form chỉnh sửa: Username, Email, Phone, Location, Bio, Avatar
5. Người dùng chỉnh sửa thông tin
6. Người dùng nhấn "Lưu thay đổi"
7. Hệ thống validate và cập nhật thông tin
8. Hệ thống hiển thị thông báo thành công

---

### UC-06: Chọn game để chơi

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-06 |
| **Tên Use Case** | Chọn game để chơi |
| **Actor** | User |
| **Mô tả** | Người chơi lựa chọn game muốn chơi từ danh sách 7 game có sẵn |
| **Điều kiện tiên quyết** | Người dùng đã đăng nhập |
| **Điều kiện sau** | Hiển thị UI chọn thời gian/mode cho game đã chọn |

**Luồng chính (Main Flow):**
1. User truy cập `/boardgame`
2. Hệ thống hiển thị danh sách 7 game dạng card: Caro 5, Caro 4, Tic-tac-toe, Snake, Match-3, Memory, Free Draw
3. User click chọn game muốn chơi
4. Hệ thống mở TimeSelectionModal với các tùy chọn: 1 phút, 3 phút, 5 phút, 10 phút, Không giới hạn
5. Hệ thống kiểm tra xem có game đã lưu không
6. Nếu có game đã lưu: Hiển thị option "Chơi tiếp" hoặc "Chơi mới"
7. User chọn option và nhấn "Bắt đầu"

---

### UC-07: Bắt đầu game mới

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-07 |
| **Tên Use Case** | Bắt đầu game mới |
| **Actor** | User |
| **Mô tả** | Khởi tạo một ván game mới |
| **Điều kiện tiên quyết** | - Đã chọn game<br>- Đã chọn thời gian |
| **Điều kiện sau** | - Game session mới được tạo<br>- Game bắt đầu chạy |

**Luồng chính (Main Flow):**
1. User chọn "New Game" từ TimeSelectionModal
2. Hệ thống gọi API `POST /api/games/sessions` với game_id và duration
3. Backend tạo session mới với trạng thái 'playing'
4. Hệ thống hiển thị countdown 3-2-1
5. Game bắt đầu chạy với timer đếm ngược (nếu có giới hạn thời gian)
6. Hệ thống hiển thị GamePlayArea với các controls: Pause, Save, Exit

---

### UC-08: Tiếp tục game đã lưu

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-08 |
| **Tên Use Case** | Tiếp tục game đã lưu |
| **Actor** | User |
| **Mô tả** | Tải và chơi tiếp trạng thái game đã lưu trước đó |
| **Điều kiện tiên quyết** | Có ít nhất một game đã lưu (saved session tồn tại) |
| **Điều kiện sau** | Game được khôi phục đúng trạng thái đã lưu |

**Luồng chính (Main Flow):**
1. User chọn game trong danh sách
2. Hệ thống kiểm tra có saved session qua API `GET /api/games/sessions/exists/:gameId`
3. Nếu có saved session, hiển thị option "Chơi tiếp"
4. User chọn "Chơi tiếp"
5. Hệ thống gọi API với action 'resume'
6. Backend restore game state từ game_saves table
7. Hệ thống hiển thị game với đúng trạng thái: board, score, remaining time
8. Game tiếp tục từ trạng thái đã lưu

---

### UC-09: Chơi game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-09 |
| **Tên Use Case** | Chơi game |
| **Actor** | User |
| **Mô tả** | Thực hiện các thao tác chơi trong game |
| **Điều kiện tiên quyết** | Game đã được bắt đầu |
| **Điều kiện sau** | Trạng thái game được cập nhật theo thao tác |

**Luồng chính (Main Flow):**
1. Hệ thống hiển thị bàn game tương ứng với loại game đã chọn
2. User thực hiện thao tác tùy theo game:
   - **Caro/Tic-tac-toe**: Click ô để đặt quân
   - **Snake**: Dùng phím mũi tên/WASD hoặc D-pad di chuyển
   - **Match-3**: Click/swap elements để ghép hàng
   - **Memory**: Click lật thẻ để tìm cặp
   - **Free Draw**: Click/drag để vẽ
3. Hệ thống xử lý logic game (win/lose/score)
4. Hệ thống cập nhật điểm số real-time
5. Hệ thống kiểm tra điều kiện kết thúc

---

### UC-10: Tạm dừng/Tiếp tục game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-10 |
| **Tên Use Case** | Tạm dừng/Tiếp tục game |
| **Actor** | User |
| **Mô tả** | Tạm ngừng ván game đang chơi và tiếp tục khi sẵn sàng |
| **Điều kiện tiên quyết** | Game đang ở trạng thái playing |
| **Điều kiện sau** | Game chuyển sang trạng thái paused/playing |

**Luồng chính (Main Flow):**
1. User nhấn nút "Pause" trên GameTopBar
2. Hệ thống dừng timer
3. Hệ thống hiển thị overlay pause với nút Resume
4. User nhấn "Resume"
5. Hệ thống hiển thị countdown 3-2-1
6. Game tiếp tục chạy

---

### UC-11: Lưu game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-11 |
| **Tên Use Case** | Lưu game |
| **Actor** | User |
| **Mô tả** | Lưu trạng thái game hiện tại để chơi sau |
| **Điều kiện tiên quyết** | Game đang chơi hoặc đang pause |
| **Điều kiện sau** | Game state được lưu vào database |

**Luồng chính (Main Flow):**
1. User nhấn nút "Save" trên GameTopBar
2. Hệ thống serialize game state (board, score, time_remaining, game-specific data)
3. Hệ thống gọi API `PUT /api/games/sessions/:id/save`
4. Backend lưu state vào game_saves table
5. Hệ thống hiển thị thông báo "Game đã được lưu"
6. User có thể tiếp tục chơi hoặc thoát

---

### UC-12: Kết thúc game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-12 |
| **Tên Use Case** | Kết thúc game |
| **Actor** | User |
| **Mô tả** | Hoàn thành ván game (thắng/thua/hết giờ) và nhận điểm |
| **Điều kiện tiên quyết** | Đạt điều kiện kết thúc |
| **Điều kiện sau** | - Session được đánh dấu finished<br>- Best score được cập nhật nếu đạt<br>- Achievement được kiểm tra |

**Luồng chính (Main Flow):**
1. Game kết thúc khi: Win, Lose, hoặc Time Up
2. Hệ thống gọi API `PUT /api/games/sessions/:id/finish` với final score
3. Backend cập nhật session status = 'finished'
4. Backend so sánh và cập nhật game_best_scores nếu vượt kỷ lục
5. Database trigger kiểm tra và unlock achievements
6. Hệ thống hiển thị ScoreResultModal với: Score, Best Score, Achievements unlocked
7. User có thể chọn "Chơi lại" hoặc "Thoát"

---

### UC-13: Chuyển đổi game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-13 |
| **Tên Use Case** | Chuyển đổi game |
| **Actor** | User |
| **Mô tả** | Chuyển sang chơi game khác khi đang chơi |
| **Điều kiện tiên quyết** | Đang trong một game session |
| **Điều kiện sau** | Game hiện tại được xử lý, game mới bắt đầu |

**Luồng chính (Main Flow):**
1. User click vào game card khác trong thanh game selector
2. Hệ thống hiển thị dialog xác nhận với 2 option:
   - "Lưu & Chuyển": Lưu game hiện tại rồi chuyển
   - "Chuyển không lưu": Bỏ game hiện tại và chuyển
3. User chọn option
4. Nếu "Lưu & Chuyển": Hệ thống save current game state
5. Hệ thống reset game state
6. Hệ thống load game mới được chọn

---

### UC-14: Gửi yêu cầu kết bạn

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-14 |
| **Tên Use Case** | Gửi yêu cầu kết bạn |
| **Actor** | User |
| **Mô tả** | Gửi lời mời kết bạn đến người chơi khác |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Không là bạn bè<br>- Chưa gửi request trước đó |
| **Điều kiện sau** | Friend request được tạo với status 'pending' |

**Luồng chính (Main Flow):**
1. User truy cập `/community` hoặc `/player/:id`
2. User tìm kiếm hoặc xem profile người chơi khác
3. User nhấn nút "Thêm bạn bè"
4. Hệ thống gọi API `POST /api/friends/request`
5. Backend tạo friend_request với status 'pending'
6. Hệ thống hiển thị "Đã gửi lời mời"

---

### UC-15: Xử lý yêu cầu kết bạn

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-15 |
| **Tên Use Case** | Xử lý yêu cầu kết bạn |
| **Actor** | User |
| **Mô tả** | Chấp nhận hoặc từ chối lời mời kết bạn |
| **Điều kiện tiên quyết** | Có lời mời kết bạn đang pending |
| **Điều kiện sau** | Request được xử lý (accepted/declined) |

**Luồng chính (Main Flow):**
1. User truy cập `/profile` tab Friends
2. Hệ thống hiển thị danh sách lời mời đang chờ
3. User nhấn "Chấp nhận" hoặc "Từ chối"
4. Nếu Chấp nhận:
   - API `PATCH /api/friends/requests/:id/accept`
   - Tạo bản ghi trong friends table
   - Thêm vào danh sách bạn bè cả hai bên
5. Nếu Từ chối:
   - API `PATCH /api/friends/requests/:id/decline`
   - Xóa request

---

### UC-16: Xem danh sách bạn bè

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-16 |
| **Tên Use Case** | Xem danh sách bạn bè |
| **Actor** | User |
| **Mô tả** | Xem danh sách những người đã kết bạn |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User truy cập `/profile` tab Friends
2. Hệ thống gọi API `GET /api/friends`
3. Hệ thống hiển thị danh sách bạn bè với avatar, username
4. Mỗi bạn có các action: Xem profile, Nhắn tin, Hủy kết bạn

---

### UC-17: Hủy kết bạn

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-17 |
| **Tên Use Case** | Hủy kết bạn |
| **Actor** | User |
| **Mô tả** | Xóa một người khỏi danh sách bạn bè |
| **Điều kiện tiên quyết** | Đã là bạn bè |
| **Điều kiện sau** | Quan hệ bạn bè bị xóa |

**Luồng chính (Main Flow):**
1. User vào danh sách bạn bè
2. User nhấn nút "Hủy kết bạn" bên cạnh người muốn xóa
3. Hệ thống hiển thị confirm dialog
4. User xác nhận
5. Hệ thống gọi API `DELETE /api/friends/:friendId`
6. Backend xóa bản ghi trong friends table
7. Cập nhật UI

---

### UC-18: Tìm kiếm người chơi

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-18 |
| **Tên Use Case** | Tìm kiếm người chơi |
| **Actor** | User |
| **Mô tả** | Tìm kiếm người chơi trong cộng đồng |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User truy cập `/community`
2. User nhập keyword vào ô tìm kiếm
3. Hệ thống gọi API `GET /api/friends/non-friends?search=keyword`
4. Hệ thống hiển thị danh sách người chơi phù hợp
5. User có thể xem profile hoặc gửi kết bạn

---

### UC-19: Xem hồ sơ người chơi khác

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-19 |
| **Tên Use Case** | Xem hồ sơ người chơi khác |
| **Actor** | User |
| **Mô tả** | Xem thông tin công khai của người chơi khác |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User click vào tên/avatar người chơi
2. Hệ thống chuyển đến `/player/:id`
3. Hệ thống gọi API `GET /api/users/:id` và `GET /api/users/:id/stats`
4. Hệ thống hiển thị: Avatar, Username, Bio, Location, Statistics, Achievements

---

### UC-20: Gửi tin nhắn

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-20 |
| **Tên Use Case** | Gửi tin nhắn |
| **Actor** | User |
| **Mô tả** | Gửi tin nhắn văn bản hoặc file đến bạn bè |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Đã là bạn bè với người nhận |
| **Điều kiện sau** | Tin nhắn được lưu và gửi đến người nhận |

**Luồng chính (Main Flow):**
1. User truy cập `/messages`
2. User chọn cuộc hội thoại hoặc tạo mới
3. User nhập nội dung tin nhắn
4. (Tùy chọn) User đính kèm file
5. User nhấn Enter hoặc nút Send
6. Hệ thống gọi API `POST /api/conversations/:id/messages`
7. Tin nhắn được hiển thị trong chat
8. Hệ thống đánh dấu tin nhắn là đã gửi

---

### UC-21: Xem hộp thư

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-21 |
| **Tên Use Case** | Xem hộp thư |
| **Actor** | User |
| **Mô tả** | Xem danh sách tất cả cuộc hội thoại |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User truy cập `/messages`
2. Hệ thống gọi API `GET /api/conversations`
3. Hệ thống hiển thị danh sách cuộc hội thoại với: Avatar, Username, Last message, Unread count
4. User click vào cuộc hội thoại để xem chi tiết
5. Hệ thống gọi API `GET /api/conversations/:id/messages`
6. Hệ thống hiển thị lịch sử tin nhắn
7. Hệ thống đánh dấu đã đọc qua API `POST /api/conversations/:id/read`

---

### UC-22: React tin nhắn

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-22 |
| **Tên Use Case** | React tin nhắn |
| **Actor** | User |
| **Mô tả** | Thêm biểu tượng cảm xúc (reaction) vào tin nhắn |
| **Điều kiện tiên quyết** | Đang xem cuộc hội thoại |
| **Điều kiện sau** | Reaction được lưu và hiển thị |

**Luồng chính (Main Flow):**
1. User hover/click vào tin nhắn
2. Hệ thống hiển thị emoji picker
3. User chọn emoji
4. Hệ thống gọi API `PATCH /api/messages/:messageId/reaction`
5. Reaction được hiển thị bên dưới tin nhắn

---

### UC-23: Xem xếp hạng hệ thống

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-23 |
| **Tên Use Case** | Xem xếp hạng hệ thống |
| **Actor** | User |
| **Mô tả** | Xem bảng xếp hạng điểm cao toàn hệ thống theo từng game |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User truy cập `/rankings`
2. Hệ thống hiển thị tab "Global"
3. User chọn game từ dropdown filter
4. Hệ thống gọi API `GET /api/ranking/system/:game_id`
5. Hệ thống hiển thị bảng xếp hạng: Rank, Avatar, Username, Best Score
6. User của mình được highlight nếu có trong bảng

---

### UC-24: Xem xếp hạng bạn bè

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-24 |
| **Tên Use Case** | Xem xếp hạng bạn bè |
| **Actor** | User |
| **Mô tả** | Xem bảng xếp hạng trong nhóm bạn bè |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User truy cập `/rankings`
2. User chọn tab "Friends"
3. User chọn game từ dropdown filter
4. Hệ thống gọi API `GET /api/ranking/friend/:game_id`
5. Hệ thống hiển thị bảng xếp hạng chỉ gồm bạn bè và mình

---

### UC-25: Xem thành tựu cá nhân

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-25 |
| **Tên Use Case** | Xem thành tựu cá nhân |
| **Actor** | User |
| **Mô tả** | Xem danh sách thành tựu đã mở khóa |
| **Điều kiện tiên quyết** | Đã đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User truy cập `/profile` tab Achievements
2. Hệ thống gọi API `GET /api/achievements/user/:user_id`
3. Hệ thống hiển thị danh sách thành tựu:
   - Thành tựu đã mở: Icon, Tên, Mô tả, Ngày đạt được
   - Thành tựu chưa mở: Hiển thị mờ với điều kiện cần đạt
4. User có thể filter theo game

---

### UC-26: Xem danh sách review game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-26 |
| **Tên Use Case** | Xem danh sách review game |
| **Actor** | User, Guest |
| **Mô tả** | Xem đánh giá của người chơi về các game |
| **Điều kiện tiên quyết** | Không cần đăng nhập |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. User/Guest truy cập `/reviews`
2. Hệ thống hiển thị danh sách game với rating trung bình
3. User chọn game cụ thể
4. Hệ thống gọi API `GET /api/games/:gameId/reviews`
5. Hệ thống hiển thị: Rating summary (phân bố sao), danh sách review với avatar, username, rating, comment, date

---

### UC-27: Viết review game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-27 |
| **Tên Use Case** | Viết review game |
| **Actor** | User |
| **Mô tả** | Đánh giá và bình luận về game |
| **Điều kiện tiên quyết** | - Đã đăng nhập<br>- Chưa review game này |
| **Điều kiện sau** | Review được lưu và hiển thị |

**Luồng chính (Main Flow):**
1. User truy cập `/reviews`
2. User chọn game muốn review
3. User chọn số sao (1-5)
4. User nhập comment
5. User nhấn "Gửi đánh giá"
6. Hệ thống gọi API `POST /api/games/:gameId/reviews`
7. Review được hiển thị trong danh sách

---

### UC-28: Xóa review

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-28 |
| **Tên Use Case** | Xóa review |
| **Actor** | User |
| **Mô tả** | Xóa đánh giá của mình về game |
| **Điều kiện tiên quyết** | Có review của mình |
| **Điều kiện sau** | Review bị xóa khỏi hệ thống |

**Luồng chính (Main Flow):**
1. User xem review của mình
2. User nhấn nút "Xóa"
3. Hệ thống hiển thị confirm dialog
4. User xác nhận
5. Hệ thống gọi API `DELETE /api/games/:gameId/reviews/:reviewId`
6. Review bị xóa khỏi danh sách

---

### UC-29: Quản lý người dùng

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-29 |
| **Tên Use Case** | Quản lý người dùng |
| **Actor** | Admin |
| **Mô tả** | CRUD tài khoản người dùng trong hệ thống |
| **Điều kiện tiên quyết** | Đã đăng nhập với role Admin |
| **Điều kiện sau** | Thay đổi được lưu vào database |

**Luồng chính (Main Flow):**
1. Admin truy cập `/admin/users`
2. Hệ thống hiển thị bảng danh sách users với pagination
3. Admin có thể:
   - **Tìm kiếm**: Nhập keyword để filter
   - **Tạo mới**: Mở form tạo user mới
   - **Chỉnh sửa**: Click Edit để sửa thông tin user
   - **Xóa**: Click Delete để xóa user
4. Hệ thống gọi API tương ứng (POST/PUT/DELETE)

---

### UC-30: Vô hiệu hóa/Kích hoạt tài khoản

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-30 |
| **Tên Use Case** | Vô hiệu hóa/Kích hoạt tài khoản |
| **Actor** | Admin |
| **Mô tả** | Enable/Disable tài khoản người dùng |
| **Điều kiện tiên quyết** | Đã đăng nhập với role Admin |
| **Điều kiện sau** | Trạng thái user được thay đổi |

**Luồng chính (Main Flow):**
1. Admin vào `/admin/users`
2. Admin toggle switch Status của user
3. Hệ thống gọi API `PUT /api/users/:id` với status mới
4. User bị vô hiệu hóa sẽ không thể đăng nhập

---

### UC-31: Quản lý game

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-31 |
| **Tên Use Case** | Quản lý game |
| **Actor** | Admin |
| **Mô tả** | CRUD danh sách game trong hệ thống |
| **Điều kiện tiên quyết** | Role Admin |
| **Điều kiện sau** | Thay đổi được lưu |

**Luồng chính (Main Flow):**
1. Admin truy cập `/admin/games`
2. Hệ thống hiển thị danh sách games
3. Admin có thể:
   - Enable/Disable game
   - Chỉnh sửa thông tin game (tên, mô tả, kích thước board...)
   - Xem thống kê số người chơi
4. Hệ thống gọi API tương ứng

---

### UC-32: Quản lý thành tựu

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-32 |
| **Tên Use Case** | Quản lý thành tựu |
| **Actor** | Admin |
| **Mô tả** | CRUD thành tựu cho các game |
| **Điều kiện tiên quyết** | Role Admin |
| **Điều kiện sau** | Thay đổi được lưu |

**Luồng chính (Main Flow):**
1. Admin truy cập `/admin/achievements`
2. Hệ thống hiển thị danh sách achievements theo game
3. Admin có thể:
   - Tạo thành tựu mới: Tên, Mô tả, Icon, Điều kiện, Game
   - Chỉnh sửa thành tựu
   - Xóa thành tựu
4. Hệ thống gọi API tương ứng (POST/PUT/DELETE /api/achievement)

---

### UC-33: Xem Dashboard thống kê

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-33 |
| **Tên Use Case** | Xem Dashboard thống kê |
| **Actor** | Admin |
| **Mô tả** | Xem các biểu đồ thống kê tổng quan hệ thống |
| **Điều kiện tiên quyết** | Role Admin |
| **Điều kiện sau** | Không thay đổi |

**Luồng chính (Main Flow):**
1. Admin truy cập `/admin/dashboard`
2. Hệ thống gọi các API thống kê:
   - `GET /api/dashboard/stats`: Tổng users, games, sessions
   - `GET /api/dashboard/registration-chart`: Biểu đồ đăng ký theo thời gian
   - `GET /api/dashboard/activity-chart`: Biểu đồ hoạt động chơi game
   - `GET /api/dashboard/popularity-chart`: Game phổ biến nhất
   - `GET /api/dashboard/achievement-chart`: Thống kê thành tựu
3. Hệ thống render các biểu đồ (Line chart, Bar chart, Pie chart)

---

### UC-34: Thay đổi theme giao diện

| Thuộc tính | Chi tiết |
|------------|----------|
| **Use Case ID** | UC-34 |
| **Tên Use Case** | Thay đổi theme giao diện |
| **Actor** | User, Admin |
| **Mô tả** | Chuyển đổi giữa Dark mode và Light mode |
| **Điều kiện tiên quyết** | Không cần |
| **Điều kiện sau** | Theme được lưu vào localStorage |

**Luồng chính (Main Flow):**
1. User click vào toggle theme (sun/moon icon) trên Navbar
2. Hệ thống chuyển đổi class theme
3. Hệ thống lưu preference vào localStorage
4. Giao diện cập nhật ngay lập tức

---

## PHẦN 5: BIỂU ĐỒ USE CASE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BOARD GAME SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────┐                                                   ┌─────────┐  │
│  │Guest│                                                   │  Admin  │  │
│  └──┬──┘                                                   └────┬────┘  │
│     │                                                           │       │
│     ├──○ UC-01: Đăng ký                                         │       │
│     ├──○ UC-02: Đăng nhập                                       │       │
│     ├──○ UC-04: Quên mật khẩu                                   │       │
│     ├──○ UC-26: Xem review (public)                             │       │
│     │                                                           │       │
│  ┌──┴──┐                                                        │       │
│  │User │────────────────────────────────────────────────────────┘       │
│  └──┬──┘                                                                │
│     │                                                                   │
│     ├──○ UC-03: Đăng xuất                                               │
│     ├──○ UC-05: Quản lý hồ sơ                                           │
│     ├──○ UC-06~UC-13: Các use case chơi game                           │
│     ├──○ UC-14~UC-19: Các use case kết bạn & cộng đồng                 │
│     ├──○ UC-20~UC-22: Các use case nhắn tin                            │
│     ├──○ UC-23~UC-24: Xem xếp hạng                                      │
│     ├──○ UC-25: Xem thành tựu                                           │
│     ├──○ UC-27~UC-28: Viết/Xóa review                                   │
│     └──○ UC-34: Thay đổi theme                                          │
│                                                                         │
│  Admin extends User:                                                    │
│     ├──○ UC-29~UC-30: Quản lý người dùng                                │
│     ├──○ UC-31: Quản lý game                                            │
│     ├──○ UC-32: Quản lý thành tựu                                       │
│     └──○ UC-33: Xem Dashboard                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Ghi chú:**
- Tài liệu này được tạo tự động dựa trên phân tích source code
- Các giả định được đưa ra dựa trên cấu trúc code và naming convention
- Phù hợp để nộp đồ án + thuyết trình seminar

---

*Document Version: 1.0 | Last Updated: 19/01/2026*
