# API Contract: Global Navbar Search

## Endpoint: Search Catalog

`GET /api/search`

Performs real-time partial text search across lessons, cover videos, and sheet music scores.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | `string` | Yes | - | Search query string (min 2 chars, max 100 chars) |
| `limit` | `integer` | No | `20` | Max items per category (max 20) |

### Response Headers

- `Content-Type: application/json`
- `Cache-Control: private, max-age=60`

### Success Response (200 OK)

```json
{
  "query": "Beethoven",
  "totalCount": 5,
  "lessons": [
    {
      "id": "les-101",
      "title": "Mastering Beethoven's Moonlight Sonata 1st Movement",
      "category": "Lesson",
      "subtitle": "Classical Piano Series • Stephanie Halim",
      "thumbnailUrl": "/thumbnails/moonlight.jpg",
      "badgeText": "Intermediate",
      "priceOrDuration": "28 mins",
      "routeUrl": "/courses/classical-mastery/moonlight-sonata"
    }
  ],
  "covers": [
    {
      "id": "cov-202",
      "title": "Moonlight Sonata (Gospel Jazz Re-Arrangement)",
      "category": "Performance Cover",
      "subtitle": "Arranged by Phanilie",
      "thumbnailUrl": "/thumbnails/moonlight-jazz.jpg",
      "badgeText": "Performance Video",
      "priceOrDuration": "4 mins",
      "routeUrl": "/covers/moonlight-gospel-jazz"
    }
  ],
  "sheetMusic": [
    {
      "id": "sh-303",
      "title": "Beethoven - Fur Elise (Jazz Ballad Solo Piano)",
      "category": "Sheet Music",
      "subtitle": "Ludwig van Beethoven • Arr. Stephanie",
      "thumbnailUrl": "/thumbnails/fur-elise-sheet.jpg",
      "badgeText": "PDF Score",
      "priceOrDuration": "$14.99",
      "routeUrl": "/sheets/fur-elise-jazz-ballad"
    }
  ]
}
```

### Error Responses

#### 400 Bad Request (Query Too Short)

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Search query must be at least 2 characters long."
}
```
