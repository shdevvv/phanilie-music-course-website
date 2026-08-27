# API Contract: Digital Sheet Music Store & Library

## 1. Get Sheet Music Store Catalog

`GET /api/sheetmusic?difficulty=Intermediate&genre=Gospel&search=Grace`

### Response (200 OK)

```json
[
  {
    "id": 1,
    "title": "Amazing Grace (Advanced Gospel Arrangement)",
    "composer": "John Newton",
    "arranger": "Stephanie Halim",
    "difficulty": "Intermediate",
    "genre": "Gospel",
    "keySignature": "Ab Major",
    "pageCount": 4,
    "priceIDR": 49000.0,
    "priceUSD": 3.99,
    "thumbnailUrl": "/coversheets/sheet1.png",
    "isOwned": false
  }
]
```

---

## 2. Get User Personal Digital Library

`GET /api/sheetmusic/library`

Requires Authorization header (`Bearer <token>`).

### Response (200 OK)

```json
[
  {
    "libraryId": 101,
    "sheetMusicId": 1,
    "title": "Amazing Grace (Advanced Gospel Arrangement)",
    "arranger": "Stephanie Halim",
    "purchasedAt": "2026-08-06T18:00:00Z",
    "downloadUrl": "/api/sheetmusic/1/download"
  }
]
```
