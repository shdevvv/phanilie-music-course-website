# API Contract: Community Discussion Forums

## 1. Get Forum Threads

`GET /api/forum/threads?category=Technique`

### Response (200 OK)

```json
[
  {
    "id": 1,
    "authorName": "Marcus Sterling",
    "avatarUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    "title": "Best exercises for 4th and 5th finger independence?",
    "category": "Technique",
    "content": "I am struggling with weak 4th finger movement when playing Hanon Ex. 1...",
    "upvotes": 12,
    "repliesCount": 4,
    "createdAt": "2026-08-06T10:00:00Z",
    "isUpvoted": false
  }
]
```

---

## 2. Create Discussion Thread

`POST /api/forum/threads`

### Request Body

```json
{
  "title": "Pedal technique on acoustic vs digital piano",
  "category": "Equipment",
  "content": "Does half-pedaling feel significantly different on digital weighted keyboards?"
}
```

---

## 3. Post Reply to Thread

`POST /api/forum/threads/{id}/replies`

### Request Body

```json
{
  "content": "Great question! Most high-end digital pedals support continuous damper sensing..."
}
```
