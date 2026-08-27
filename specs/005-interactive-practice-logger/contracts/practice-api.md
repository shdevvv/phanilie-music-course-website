# API Contract: Interactive Practice Logger & Streaks

## 1. Get Practice Log History

`GET /api/practicelogs`

Requires Authorization header (`Bearer <token>`).

### Response (200 OK)

```json
[
  {
    "id": 1,
    "sessionDate": "2026-08-06T18:00:00Z",
    "durationMinutes": 45,
    "focusTitle": "Gospel Passing Chords 2-5-1",
    "category": "Repertoire",
    "notes": "Focused on smooth voice leading in C and F.",
    "rating": "Challenging"
  }
]
```

---

## 2. Create Practice Log Entry

`POST /api/practicelogs`

### Request Body

```json
{
  "durationMinutes": 30,
  "focusTitle": "Jazz Shell Voicings",
  "category": "Technique",
  "notes": "Practiced 12 keys shell voicings with metronome at 80 BPM.",
  "rating": "Mastered"
}
```

---

## 3. Get Practice Streak & Weekly Heatmap

`GET /api/practicelogs/streak`

### Response (200 OK)

```json
{
  "currentStreakDays": 5,
  "longestStreakDays": 12,
  "totalPracticeMinutes": 480,
  "weeklyDays": [true, true, true, true, true, false, false]
}
```
