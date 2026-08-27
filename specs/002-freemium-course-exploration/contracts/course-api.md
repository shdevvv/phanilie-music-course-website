# API Contract: Freemium Course Exploration

## 1. Get Public Course Tree Catalog

`GET /api/courses`

Returns full public course curriculum tree grouped by level, topics, and lesson metadata.

### Response (200 OK)

```json
[
  {
    "id": 1,
    "title": "Gospel Chords & Progressive Voicings",
    "level": "Intermediate",
    "description": "Learn 7th, 9th, and 13th chord substitutions for modern Gospel piano.",
    "thumbnailUrl": "/coversheets/sheet1.png",
    "topics": [
      {
        "id": 10,
        "title": "Module 1: 7th Chord Substitutions",
        "sequenceOrder": 1,
        "lessons": [
          {
            "id": 101,
            "title": "Major 7th & Minor 7th Voicings",
            "summary": "Mastering smooth 2-5-1 voicings in key of C and F.",
            "durationMinutes": 24,
            "sequenceOrder": 1
          }
        ]
      }
    ]
  }
]
```

---

## 2. Get Protected Lesson Media Access

`GET /api/lessons/{id}/media`

Requires JWT Authorization header (`Authorization: Bearer <token>`) and active subscription.

### Success Response (200 OK) - Active Subscriber

```json
{
  "lessonId": 101,
  "videoStreamUrl": "/api/lessons/101/stream?token=abc123signed",
  "pdfDownloadUrl": "/api/lessons/101/pdf?token=abc123signed"
}
```

### Error Response (403 Forbidden) - Non-Subscriber / Free User

```json
{
  "status": 403,
  "error": "MembershipRequired",
  "message": "An active subscription is required to stream lesson videos or download PDF scores."
}
```
