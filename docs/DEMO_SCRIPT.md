# KỊCH BẢN DEMO - BOARD GAME SYSTEM

**Thời lượng:** 10-15 phút  
**Số slide hỗ trợ:** 5-7 slides (optional)  
**Ngày chuẩn bị:** 19/01/2026

---

## PHẦN 1: GIỚI THIỆU (2 phút)

### 1.1. Mở đầu (30 giây)

> **Nói:**
> 
> "Xin chào thầy/cô và các bạn. Hôm nay nhóm em xin trình bày đồ án môn học với đề tài **Board Game System** - Hệ thống chơi Board Game trực tuyến."

### 1.2. Đặt vấn đề (45 giây)

> **Nói:**
> 
> "Trong thời đại công nghệ số, các trò chơi giải trí đơn giản như Caro, Tic-tac-toe, Snake... vẫn là những trò chơi được nhiều người yêu thích. Tuy nhiên, các ứng dụng hiện tại thường:
> - Chỉ có một game đơn lẻ
> - Không lưu được tiến trình chơi
> - Thiếu tính năng xã hội như kết bạn, nhắn tin
> - Không có hệ thống thành tựu để tạo động lực
> 
> Đó là lý do nhóm em xây dựng Board Game System - nơi tổng hợp nhiều game cổ điển với đầy đủ tính năng xã hội và gamification."

### 1.3. Đối tượng sử dụng (30 giây)

> **Nói:**
> 
> "Hệ thống hướng đến 3 đối tượng:
> 1. **Người chơi thông thường** - muốn giải trí với các game đơn giản
> 2. **Người chơi cạnh tranh** - muốn so sánh điểm số, leo bảng xếp hạng
> 3. **Quản trị viên** - quản lý hệ thống, người dùng và nội dung"

### 1.4. Công nghệ sử dụng (15 giây)

> **Nói:**
> 
> "Về mặt kỹ thuật:
> - Frontend: ReactJS với Vite và Ant Design
> - Backend: Express.js với kiến trúc MVC
> - Database: PostgreSQL qua Supabase
> - ORM: Knex.js"

---

## PHẦN 2: DEMO CHÍNH (10-11 phút)

### 2.1. Demo vai trò Guest - Đăng ký & Đăng nhập (2 phút)

#### Bước 1: Mở trang chủ
| Thao tác | Nói |
|----------|-----|
| Mở trình duyệt, truy cập URL hệ thống | "Đây là trang chủ của hệ thống. Giao diện hỗ trợ cả Dark mode và Light mode." |
| Scroll xuống xem các game | "Ở đây hiển thị danh sách 7 game có trong hệ thống." |

#### Bước 2: Đăng ký tài khoản
| Thao tác | Nói |
|----------|-----|
| Click nút "Đăng ký" | "Để sử dụng hệ thống, trước tiên cần đăng ký tài khoản." |
| Điền form: username, email, password | "Form đăng ký có validation realtime - khi nhập sai format sẽ báo lỗi ngay." |
| Nhập password yếu để thấy validation | "Như các bạn thấy, hệ thống yêu cầu mật khẩu mạnh với chữ hoa, chữ thường, số và ký tự đặc biệt." |
| Hoàn thành đăng ký | "Sau khi đăng ký thành công, hệ thống chuyển đến trang đăng nhập." |

#### Bước 3: Đăng nhập
| Thao tác | Nói |
|----------|-----|
| Nhập email/password vừa tạo | "Đăng nhập với tài khoản vừa tạo..." |
| Đăng nhập thành công | "Và đây là trang chủ sau khi đăng nhập. Navbar đã thay đổi hiển thị các menu cho user." |

**Kết quả mong đợi:** Navbar hiển thị avatar, có menu Profile, Messages, Logout.

---

### 2.2. Demo vai trò User - Chơi game (3 phút)

#### Bước 1: Chọn game
| Thao tác | Nói |
|----------|-----|
| Click menu "Board Game" | "Đây là trang chính để chơi game." |
| Hiển thị 7 game cards | "Hệ thống có 7 game: Caro 5 hàng, Caro 4 hàng, Tic-tac-toe, Snake, Match-3, Memory và Free Draw." |
| Click vào game "Snake" | "Em sẽ demo game Snake - Rắn săn mồi." |

#### Bước 2: Chọn thời gian
| Thao tác | Nói |
|----------|-----|
| Modal Time Selection xuất hiện | "Trước khi chơi, user chọn giới hạn thời gian: 1, 3, 5, 10 phút hoặc không giới hạn." |
| Chọn "3 phút" | "Em chọn 3 phút." |
| Nhấn "New Game" | "Bắt đầu game mới..." |

#### Bước 3: Chơi game
| Thao tác | Nói |
|----------|-----|
| Countdown 3-2-1 hiện lên | "Có countdown 3 giây để chuẩn bị." |
| Game bắt đầu | "Game bắt đầu. Điều khiển bằng phím mũi tên hoặc WASD. Trên mobile có D-pad." |
| Chơi khoảng 15-20 giây | "Mục tiêu là ăn nhiều mồi nhất có thể trong thời gian giới hạn." |
| Click nút Pause | "Có thể Pause game bất cứ lúc nào..." |
| Click Resume | "...và tiếp tục khi sẵn sàng." |

#### Bước 4: Lưu game
| Thao tác | Nói |
|----------|-----|
| Click nút Save | "Tính năng quan trọng: Lưu game để chơi sau. Hệ thống lưu toàn bộ trạng thái: vị trí rắn, điểm, thời gian còn lại." |
| Thông báo "Game saved" | "Game đã được lưu thành công." |

#### Bước 5: Chuyển game
| Thao tác | Nói |
|----------|-----|
| Click vào game card khác (Memory) | "Nếu muốn chơi game khác, có thể chuyển ngay." |
| Dialog xuất hiện | "Hệ thống hỏi có muốn lưu game hiện tại không." |
| Chọn "Lưu & Chuyển" | "Chọn Lưu & Chuyển để không mất tiến trình." |
| Game Memory load | "Và đây là game Memory - Cờ trí nhớ." |

**Kết quả mong đợi:** Chuyển qua game mới mượt mà, không mất data.

---

### 2.3. Demo vai trò User - Tính năng xã hội (3 phút)

#### Bước 1: Cộng đồng & Kết bạn
| Thao tác | Nói |
|----------|-----|
| Click menu "Community" | "Trang Cộng đồng hiển thị tất cả người chơi trong hệ thống." |
| Nhập tên vào ô Search | "Có thể tìm kiếm theo username..." |
| Click vào một user | "...và xem profile của họ." |
| Click "Thêm bạn bè" | "Gửi yêu cầu kết bạn chỉ với 1 click." |
| Thông báo "Đã gửi lời mời" | "Lời mời đã được gửi thành công." |

#### Bước 2: Nhắn tin
| Thao tác | Nói |
|----------|-----|
| Click menu "Messages" | "Đây là trang nhắn tin - giao diện tương tự Facebook Messenger." |
| Chọn một conversation | "Danh sách cuộc hội thoại bên trái, nội dung chat bên phải." |
| Gõ tin nhắn và gửi | "Gửi tin nhắn văn bản..." |
| Click đính kèm file | "...hoặc đính kèm file." |
| Hover vào tin nhắn, chọn emoji | "Có thể react tin nhắn với emoji." |

**Kết quả mong đợi:** Tin nhắn gửi thành công, reaction hiển thị.

#### Bước 3: Xếp hạng
| Thao tác | Nói |
|----------|-----|
| Click menu "Rankings" | "Bảng xếp hạng điểm cao theo từng game." |
| Chọn tab "Global" | "Tab Global là xếp hạng toàn hệ thống." |
| Chọn game từ dropdown | "Có thể filter theo từng game." |
| Chọn tab "Friends" | "Tab Friends chỉ hiển thị xếp hạng trong nhóm bạn bè - để cạnh tranh với bạn bè." |

---

### 2.4. Demo vai trò User - Profile & Thành tựu (2 phút)

#### Bước 1: Profile
| Thao tác | Nói |
|----------|-----|
| Click avatar > Profile | "Trang Profile cá nhân với nhiều tab thông tin." |
| Tab Profile hiển thị | "Thông tin cơ bản: avatar, username, bio, location..." |
| Click "Chỉnh sửa" | "Có thể cập nhật thông tin bất cứ lúc nào." |

#### Bước 2: Thành tựu
| Thao tác | Nói |
|----------|-----|
| Click tab "Achievements" | "Hệ thống thành tựu - gamification để tăng engagement." |
| Scroll danh sách thành tựu | "Thành tựu được mở khóa tự động dựa trên điểm số." |
| Chỉ vào thành tựu đã mở | "Ví dụ: đạt 100 điểm Snake sẽ mở thành tựu 'Snake Beginner'." |
| Chỉ vào thành tựu chưa mở | "Thành tựu chưa đạt sẽ hiển thị mờ với điều kiện cần đạt." |

#### Bước 3: Lịch sử chơi
| Thao tác | Nói |
|----------|-----|
| Click tab "Game History" | "Lịch sử tất cả các ván đã chơi: game, điểm, thời gian, trạng thái." |

---

### 2.5. Demo vai trò Admin (2 phút)

#### Bước 1: Đăng nhập Admin
| Thao tác | Nói |
|----------|-----|
| Logout, đăng nhập tài khoản admin | "Giờ em sẽ demo vai trò Admin. Đăng nhập với tài khoản admin..." |
| Chuyển đến Admin Dashboard | "Admin được chuyển thẳng đến trang Dashboard." |

#### Bước 2: Dashboard
| Thao tác | Nói |
|----------|-----|
| Chỉ vào các thống kê | "Dashboard hiển thị tổng quan: số user, số game, số sessions." |
| Chỉ vào biểu đồ | "Các biểu đồ: đăng ký theo thời gian, game phổ biến, hoạt động chơi game." |

#### Bước 3: Quản lý Users
| Thao tác | Nói |
|----------|-----|
| Click menu "Users" | "Quản lý người dùng với đầy đủ CRUD." |
| Search một user | "Tìm kiếm user..." |
| Toggle status | "Vô hiệu hóa/kích hoạt tài khoản." |

#### Bước 4: Quản lý Games & Achievements
| Thao tác | Nói |
|----------|-----|
| Click menu "Games" | "Quản lý danh sách games: enable/disable, chỉnh sửa thông tin." |
| Click menu "Achievements" | "Quản lý thành tựu: tạo, sửa, xóa thành tựu cho từng game." |

---

## PHẦN 3: ĐIỂM NỔI BẬT (1 phút)

> **Nói:**
>
> "Qua demo, em xin tóm tắt các điểm nổi bật của hệ thống:
>
> 1. **7 games đa dạng** - từ chiến thuật (Caro) đến điều khiển (Snake) đến sáng tạo (Free Draw)
>
> 2. **Lưu/Tiếp tục game** - không mất tiến trình, có thể chơi tiếp bất cứ lúc nào
>
> 3. **Hệ thống Achievement tự động** - database trigger tự động unlock thành tựu
>
> 4. **Tính năng xã hội đầy đủ** - kết bạn, nhắn tin, xem xếp hạng bạn bè
>
> 5. **Dark/Light mode** - hỗ trợ cả 2 theme, lưu preference
>
> 6. **Responsive design** - chơi được trên cả desktop và mobile
>
> 7. **RESTful API hoàn chỉnh** - có Swagger documentation đầy đủ"

---

## PHẦN 4: KẾT THÚC & ĐỊNH HƯỚNG (1 phút)

### 4.1. Tổng kết (30 giây)

> **Nói:**
>
> "Tổng kết lại, Board Game System là hệ thống chơi game web với:
> - 7 trò chơi bàn cổ điển
> - Hệ thống người dùng với xác thực JWT
> - Tính năng xã hội: bạn bè, tin nhắn temail
> - Gamification: thành tựu, bảng xếp hạng
> - Phân quyền User/Admin rõ ràng
> - Giao diện hiện đại với Ant Design"

### 4.2. Hướng phát triển (30 giây)

> **Nói:**
>
> "Trong tương lai, nhóm em định hướng phát triển:
>
> 1. **Thêm AI đối thủ** - cho các game như Caro, Tic-tac-toe với nhiều cấp độ
>
> 2. **Multiplayer realtime** - chơi đối kháng với bạn bè qua Socket
>
> 3. **Thêm games mới** - 2048, Sudoku, Minesweeper...
>
> 4. **Mobile app** - React Native cho iOS và Android
>
> 5. **Tournament system** - tổ chức giải đấu giữa các người chơi
>
> Em xin kết thúc phần trình bày. Cảm ơn thầy/cô và các bạn đã lắng nghe. Nhóm em sẵn sàng trả lời các câu hỏi."

---

## PHỤ LỤC: CHECKLIST CHUẨN BỊ TRƯỚC KHI DEMO

### Dữ liệu test cần có:
- [ ] 1 tài khoản user thường (để demo đăng ký mới)
- [ ] 1 tài khoản user có sẵn friends, messages, achievements
- [ ] 1 tài khoản admin
- [ ] Có ít nhất 1 game đã lưu (saved session)
- [ ] Có dữ liệu ranking cho các games

### Kiểm tra kỹ thuật:
- [ ] Backend đang chạy
- [ ] Frontend đang chạy
- [ ] Database có data
- [ ] Internet ổn định (nếu dùng Supabase cloud)
- [ ] Tắt thông báo, popup trên máy

### Mẹo trình bày:
- Zoom browser 110-125% cho dễ nhìn
- Dùng màn hình rộng nếu có
- Chuẩn bị backup video recording phòng demo fail
- Nói chậm, rõ ràng khi demo thao tác

---

*Kịch bản này được thiết kế cho 10-15 phút. Có thể điều chỉnh độ dài từng phần tùy thời gian thực tế.*

---

**Prepared by:** AI Assistant  
**Date:** 19/01/2026
