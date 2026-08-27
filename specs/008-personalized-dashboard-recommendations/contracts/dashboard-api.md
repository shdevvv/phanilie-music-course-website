# API Contract: Personalized Learning Dashboard & Recommendations

## 1. Get Dashboard Summary

`GET /api/dashboard/summary`

Requires Authorization header (`Bearer <token>`).

### Response (200 OK)

```json
{
  "overallMasteryPct": 33,
  "completedLessonsCount": 5,
  "totalLessonsCount": 15,
  "totalPracticeMinutes": 640,
  "totalXP": 1250,
  "nextRecommendedLesson": {
    "lessonId": 6,
    "levelNumber": 2,
    "topicTitle": "C Major & A Minor",
    "lessonTitle": "The A Minor Scale",
    "durationMinutes": 14,
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
}
```

---

## 2. Get Student To-Do List

`GET /api/dashboard/todos`

### Response (200 OK)

```json
[
  {
    "id": 1,
    "taskDescription": "Practice C Major scale 2 octaves",
    "isCompleted": false,
    "createdAt": "2026-08-06T10:00:00Z"
  }
]
```
