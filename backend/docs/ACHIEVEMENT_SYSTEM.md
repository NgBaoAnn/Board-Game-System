# Achievement System - Cơ chế hoạt động

## Tổng quan

Hệ thống thành tựu tự động cấp achievements cho người dùng dựa trên điểm số cao nhất (best_score) của họ trong mỗi game.

## Kiến trúc

### 1. Database Trigger (Lớp 1 - Tự động)

**File:** `20260111180001_create_score_achievement_trigger.js`

PostgreSQL trigger `trigger_auto_grant_achievements` sẽ:

- **Kích hoạt:** AFTER INSERT hoặc UPDATE trên bảng `game_best_scores`
- **Hoạt động:** Chạy trong cùng transaction, đảm bảo synchronous execution
- **Logic:**
  ```sql
  IF best_score >= achievement.condition_value THEN
    INSERT INTO user_achievements (user_id, achievement_id)
    ON CONFLICT DO NOTHING
  ```

### 2. Application Layer Verification (Lớp 2 - Backup)

**File:** `game.service.js` - Method `_checkAndGrantAchievements()`

- **Mục đích:** Đảm bảo achievements được cấp ngay cả khi trigger có vấn đề
- **Thời điểm:** Chạy sau khi `updateBestScore()` hoàn thành
- **Logic:** Tương tự trigger nhưng ở application layer

### 3. Response với Achievements (Lớp 3 - UI/UX)

**File:** `game.service.js` - Method `finishSession()`

Response trả về bao gồm:

```javascript
{
  session: {...},
  bestScore: {...},
  achievements: [...] // TẤT CẢ achievements của user trong game này
}
```

## Workflow khi user hoàn thành game

```
1. Frontend gọi API: POST /api/game/session/:id/finish
   ↓
2. Backend: gameService.finishSession()
   ↓
3. Update session status = 'finished'
   ↓
4. updateBestScore() - INSERT/UPDATE game_best_scores
   ↓
5. 🔥 DATABASE TRIGGER tự động chạy trong transaction
   ↓
6. ✅ Application layer verification (backup)
   ↓
7. Query lại tất cả user_achievements
   ↓
8. Return response với achievements mới
```

## Đảm bảo tính đồng bộ

### PostgreSQL Trigger là Synchronous

PostgreSQL triggers chạy **synchronous** trong cùng transaction:

- Trigger AFTER INSERT/UPDATE hoàn thành trước khi transaction commit
- Application code chỉ nhận response sau khi trigger hoàn tất
- **Không có race condition** giữa trigger và query tiếp theo

### Double-Check Mechanism

Nếu vì lý do nào đó trigger không chạy (vd: disabled, error):

1. Application layer sẽ check và grant achievements
2. `ON CONFLICT DO NOTHING` đảm bảo không có duplicate
3. Frontend vẫn nhận đầy đủ achievements

## Testing

### Test Trigger

```sql
-- Tạo achievement yêu cầu 1000 điểm
INSERT INTO achievements (code, name, game_id, condition_type, condition_value)
VALUES ('HIGH_SCORER', 'High Scorer', 1, 'score', 1000);

-- User đạt 1500 điểm
INSERT INTO game_best_scores (user_id, game_id, best_score)
VALUES ('user-uuid', 1, 1500);

-- Check user_achievements tự động được tạo
SELECT * FROM user_achievements WHERE user_id = 'user-uuid';
```

### Test API

```bash
# Finish game session với score cao
POST /api/game/session/{session_id}/finish
{
  "score": 1500
}

# Response sẽ bao gồm achievements
{
  "session": {...},
  "bestScore": {...},
  "achievements": [
    {
      "id": "...",
      "code": "HIGH_SCORER",
      "name": "High Scorer",
      "achieved_at": "2026-01-11T..."
    }
  ]
}
```

## Performance Considerations

### Trigger Overhead

- Trigger chạy cho mỗi INSERT/UPDATE vào `game_best_scores`
- Loop qua tất cả achievements của game (thường < 50 achievements)
- Sử dụng index trên `game_id` và `condition_type`
- **Overhead nhỏ:** < 50ms cho typical case

### Application Verification

- Chỉ chạy khi finish session (không phải mọi request)
- Có thể disable nếu 100% tin tưởng trigger
- Trade-off: Safety vs Performance

## Monitoring

### Check Trigger Status

```sql
-- Xem trigger có active không
SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_grant_achievements';

-- Xem function definition
\df auto_grant_score_achievements
```

### Achievement Grant Rate

```sql
-- Số achievements được cấp trong 24h qua
SELECT COUNT(*)
FROM user_achievements
WHERE achieved_at > NOW() - INTERVAL '24 hours';
```

## Troubleshooting

### Achievements không được cấp

1. **Check trigger exists:**

   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_auto_grant_achievements';
   ```

2. **Check achievements data:**

   ```sql
   SELECT * FROM achievements WHERE game_id = ?;
   ```

3. **Manual grant (nếu cần):**
   ```sql
   INSERT INTO user_achievements (user_id, achievement_id)
   SELECT 'user-uuid', a.id
   FROM achievements a
   JOIN game_best_scores gbs ON a.game_id = gbs.game_id
   WHERE gbs.user_id = 'user-uuid'
     AND gbs.best_score >= a.condition_value
     AND a.condition_type = 'score'
   ON CONFLICT DO NOTHING;
   ```

## Future Enhancements

1. **Achievement Notifications**: WebSocket/SSE để notify real-time
2. **Achievement Analytics**: Track unlock rates, rarest achievements
3. **Multiple Condition Types**: Có thể mở rộng thêm play_count, time, v.v.
4. **Achievement Tiers**: Bronze/Silver/Gold cho cùng một achievement
