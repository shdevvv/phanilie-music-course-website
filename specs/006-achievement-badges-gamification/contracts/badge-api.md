# API Contract: Student Achievement Badges & Gamification

## 1. Get User Badges & Progress Showcase

`GET /api/badges/user`

Requires Authorization header (`Bearer <token>`).

### Response (200 OK)

```json
[
  {
    "badgeId": 1,
    "name": "First Song Mastered",
    "description": "Completed your 1st piano lesson",
    "iconUrl": "🎵",
    "isUnlocked": true,
    "unlockedAt": "2026-08-06T18:00:00Z",
    "currentValue": 1,
    "targetValue": 1,
    "progressPercentage": 100
  },
  {
    "badgeId": 2,
    "name": "Weekly Warrior",
    "description": "Maintain a 7-day practice streak",
    "iconUrl": "🔥",
    "isUnlocked": false,
    "unlockedAt": null,
    "currentValue": 5,
    "targetValue": 7,
    "progressPercentage": 71
  }
]
```

---

## 2. Evaluate Badge Unlocks

`POST /api/badges/evaluate`

### Response (200 OK)

```json
{
  "newlyUnlockedBadges": [
    {
      "badgeId": 1,
      "name": "First Song Mastered",
      "description": "Completed your 1st piano lesson",
      "iconUrl": "🎵"
    }
  ]
}
```
