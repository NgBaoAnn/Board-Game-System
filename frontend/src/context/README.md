/**
 * CONTEXT API STRUCTURE - Hướng dẫn sử dụng
 * 
 * Dự án sử dụng 5 Context chính để quản lý state toàn cục
 * Các Context đã được tích hợp sẵn vào main.jsx
 * Sử dụng Hooks tương ứng để truy cập state từ bất kỳ component nào
 */

/**
 * 1. AuthContext - Quản lý xác thực người dùng
 * File: src/context/AuthContext.jsx
 * 
 * Hook: useAuth()
 * 
 * Thuộc tính:
 * - user: object | null - Thông tin user hiện tại
 * - token: string | null - JWT token
 * - loading: boolean - Trạng thái loading
 * - isAuthenticated: boolean - Kiểm tra đã đăng nhập
 * 
 * Phương thức:
 * - login(username, password) - Đăng nhập
 * - register(username, email, password) - Đăng ký
 * - logout() - Đăng xuất
 * - updateProfile(updates) - Cập nhật thông tin
 * 
 * Lưu ý: Hiện đang dùng mock data, thay đổi fetch URLs khi backend sẵn sàng
 * TODO: Thay đổi URLs và headers theo backend API
 * 
 * Cách sử dụng:
 * 
 *   import { useAuth } from '@/context'
 *   
 *   function MyComponent() {
 *     const { user, login, logout, isAuthenticated } = useAuth()
 *     
 *     if (!isAuthenticated) return <div>Chưa đăng nhập</div>
 *     
 *     return <div>Xin chào {user.username}</div>
 *   }
 */

/**
 * 2. ThemeContext - Quản lý giao diện (Dark/Light mode)
 * File: src/context/ThemeContext.jsx
 * 
 * Hook: useTheme()
 * 
 * Thuộc tính:
 * - isDarkMode: boolean - Trạng thái dark mode
 * - antdTheme: object - Cấu hình theme cho Ant Design
 * 
 * Phương thức:
 * - toggleTheme() - Chuyển đổi dark/light
 * - setTheme(theme) - Đặt theme cụ thể ('light' | 'dark')
 * 
 * Cách sử dụng:
 * 
 *   import { useTheme } from '@/context'
 *   
 *   function ThemeToggle() {
 *     const { isDarkMode, toggleTheme } = useTheme()
 *     
 *     return (
 *       <button onClick={toggleTheme}>
 *         {isDarkMode ? 'Light Mode' : 'Dark Mode'}
 *       </button>
 *     )
 *   }
 */

/**
 * 3. GameContext - Quản lý trạng thái trò chơi
 * File: src/context/GameContext.jsx
 * 
 * Hook: useGame()
 * 
 * Thuộc tính:
 * - games: array - Danh sách các trò chơi có sẵn
 * - currentGame: object | null - Trò chơi hiện tại
 * - gameState: object | null - Trạng thái game (board, moves, etc)
 * - gameHistory: array - Lịch sử các game đã chơi
 * - isGameActive: boolean - Kiểm tra game đang chơi
 * 
 * Phương thức:
 * - startGame(gameId) - Bắt đầu game
 * - makeMove(position, player) - Thực hiện nước đi
 * - checkWinner() - Kiểm tra người thắng
 * - endGame(winner) - Kết thúc game
 * - resetGame() - Đặt lại game
 * - quitGame() - Thoát game
 * - getGameStats() - Lấy thống kê
 * 
 * TODO: Triển khai logic kiểm tra thắng cho từng game:
 *       - Tic Tac Toe: 3 nút liên tiếp
 *       - Caro 4: 4 nút liên tiếp
 *       - Caro 5: 5 nút liên tiếp
 * 
 * Cách sử dụng:
 * 
 *   import { useGame } from '@/context'
 *   
 *   function GameSelector() {
 *     const { games, startGame } = useGame()
 *     
 *     return (
 *       <div>
 *         {games.map(game => (
 *           <button key={game.id} onClick={() => startGame(game.id)}>
 *             {game.name}
 *           </button>
 *         ))}
 *       </div>
 *     )
 *   }
 */

/**
 * 4. BoardContext - Quản lý trạng thái bảng chơi
 * File: src/context/BoardContext.jsx
 * 
 * Hook: useBoard()
 * 
 * Thuộc tính:
 * - board: array | null - Ma trận bảng chơi
 * - selectedCell: object | null - Ô được chọn {row, col}
 * - boardSize: object - Kích thước bảng {rows, cols}
 * - cellHistory: array - Lịch sử các ô đã đặt
 * 
 * Phương thức:
 * - initializeBoard(rows, cols, initialValue) - Khởi tạo bảng
 * - setCellValue(row, col, value) - Đặt giá trị ô
 * - getCellValue(row, col) - Lấy giá trị ô
 * - selectCell(row, col) - Chọn ô
 * - moveSelection(direction) - Di chuyển vị trí (up/down/left/right)
 * - clearBoard() - Xóa hết bảng
 * - undoLastMove() - Hoàn tác nước đi cuối
 * - isValidMove(row, col) - Kiểm tra nước đi hợp lệ
 * 
 * TODO: Thêm logic kiểm tra win condition cho từng game
 * 
 * Cách sử dụng:
 * 
 *   import { useBoard } from '@/context'
 *   
 *   function GameBoard() {
 *     const { board, selectedCell, selectCell, setCellValue } = useBoard()
 *     
 *     const handleCellClick = (row, col) => {
 *       selectCell(row, col)
 *       setCellValue(row, col, 1)
 *     }
 *     
 *     return (
 *       <div>
 *         {board?.map((row, r) => (
 *           <div key={r}>
 *             {row.map((cell, c) => (
 *               <button
 *                 key={`${r}-${c}`}
 *                 onClick={() => handleCellClick(r, c)}
 *               >
 *                 {cell}
 *               </button>
 *             ))}
 *           </div>
 *         ))}
 *       </div>
 *     )
 *   }
 */

/**
 * 5. UserContext - Quản lý thông tin và thống kê người dùng
 * File: src/context/UserContext.jsx
 * 
 * Hook: useUser()
 * 
 * Thuộc tính:
 * - profile: object | null - Thông tin profile người dùng
 * - preferences: object - Tùy chỉnh (notifications, sound, difficulty)
 * - stats: object - Thống kê (wins, losses, streak, etc)
 * - friends: array - Danh sách bạn bè
 * - achievements: array - Các achievements đã mở khóa
 * 
 * Phương thức:
 * - updateProfile(updates) - Cập nhật profile
 * - updatePreferences(updates) - Cập nhật tùy chỉnh
 * - updateStats(updates) - Cập nhật thống kê
 * - recordGameResult(result) - Ghi lại kết quả game
 * - addFriend(friendData) - Thêm bạn
 * - removeFriend(friendId) - Xóa bạn
 * - unlockAchievement(achievement) - Mở khóa achievement
 * - getStats() - Lấy thống kê đầy đủ
 * - checkAchievements() - Kiểm tra achievements mới
 * 
 * Cách sử dụng:
 * 
 *   import { useUser } from '@/context'
 *   
 *   function UserStats() {
 *     const { stats, recordGameResult } = useUser()
 *     
 *     const handleGameEnd = (didWin) => {
 *       recordGameResult({
 *         win: didWin,
 *         draw: false,
 *         duration: 5 // minutes
 *       })
 *     }
 *     
 *     return (
 *       <div>
 *         <p>Wins: {stats.wins}</p>
 *         <p>Losses: {stats.losses}</p>
 *         <button onClick={() => handleGameEnd(true)}>Win Game</button>
 *       </div>
 *     )
 *   }
 */

/**
 * HƯỚNG DẪN NỐI VỚI BACKEND
 * 
 * Khi backend sẵn sàng, thay đổi URLs từ mock data thành API thực:
 * 
 * AuthContext:
 *   - POST /api/auth/login -> login()
 *   - POST /api/auth/register -> register()
 *   - POST /api/auth/logout -> logout()
 *   - PUT /api/auth/profile -> updateProfile()
 * 
 * GameContext:
 *   - GET /api/games -> games list
 *   - POST /api/games/{id}/start -> startGame()
 *   - PUT /api/games/{id}/move -> makeMove()
 *   - POST /api/games/{id}/end -> endGame()
 * 
 * UserContext:
 *   - GET /api/users/{id} -> profile
 *   - PUT /api/users/{id} -> updateProfile()
 *   - GET /api/users/{id}/stats -> stats
 *   - POST /api/users/{id}/friends -> addFriend()
 *   - GET /api/users/{id}/achievements -> achievements
 * 
 * Mỗi request cần kèm header:
 *   Authorization: Bearer {token}
 *   Content-Type: application/json
 */

export default {
  title: 'Context API Documentation',
  description: 'Hướng dẫn sử dụng Context API trong ứng dụng Board Game System'
}
