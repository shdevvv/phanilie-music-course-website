# API Contract: Shopping Cart & Guest Sync

**Module**: `SPEC-010 Shopping Cart & Guest Sync`  
**Base Path**: `/api/cart`  
**Authentication**: Optional for Guest endpoints (uses HTTP-only `phanilie_guest_session` cookie); Required (`Bearer JWT`) for authenticated student endpoints.

---

## 1. Retrieve Cart Contents

### `GET /api/cart`

Retrieves active cart line items, subtotals in IDR and USD, and price adjustment alerts for either authenticated user or guest cookie session.

#### Request Headers & Cookies
- `Authorization`: `Bearer <jwt_token>` (Optional)
- Cookie: `phanilie_guest_session=<guid>` (Optional for guests)

#### Response `200 OK`
```json
{
  "totalItemCount": 2,
  "subtotalIDR": 300000.0,
  "subtotalUSD": 19.98,
  "currency": "IDR",
  "hasPriceAdjustments": false,
  "items": [
    {
      "cartItemId": 12,
      "sheetMusicId": 104,
      "title": "Fantaisie-Impromptu in C# Minor",
      "composer": "Frédéric Chopin",
      "coverImageUrl": "/images/sheets/chopin-fantaisie.png",
      "unitPriceIDR": 150000.0,
      "unitPriceUSD": 9.99,
      "quantity": 1,
      "lineTotalIDR": 150000.0,
      "lineTotalUSD": 9.99,
      "isPriceAdjusted": false,
      "previousPriceIDR": null,
      "previousPriceUSD": null
    }
  ]
}
```

---

## 2. Add Item to Cart

### `POST /api/cart/items`

Adds a sheet music item to the guest or user cart. If no guest session cookie exists for an unauthenticated request, the backend creates one and attaches `Set-Cookie: phanilie_guest_session=<guid>; HttpOnly; SameSite=Lax; Path=/`.

#### Request Body
```json
{
  "sheetMusicId": 104,
  "quantity": 1
}
```

#### Response `200 OK`
Returns updated `CartDto` payload.

#### Response `400 Bad Request`
```json
{
  "error": "InvalidSheetMusic",
  "message": "Sheet music item not found or out of stock."
}
```

---

## 3. Update Item Quantity

### `PUT /api/cart/items/{sheetMusicId}`

Updates the quantity of a specific sheet music item in the cart.

#### Path Parameters
- `sheetMusicId`: `int` - ID of sheet music item

#### Request Body
```json
{
  "quantity": 2
}
```

#### Response `200 OK`
Returns updated `CartDto` payload.

---

## 4. Remove Item from Cart

### `DELETE /api/cart/items/{sheetMusicId}`

Removes a sheet music item from the active cart.

#### Path Parameters
- `sheetMusicId`: `int` - ID of sheet music item to remove

#### Response `200 OK`
Returns updated `CartDto` payload.

---

## 5. Synchronize Guest Cart Post-Login

### `POST /api/cart/sync`

Merges guest cart items from `phanilie_guest_session` cookie into the authenticated user's database cart. Overwrites overlapping user cart items with guest item quantities, clears the guest cookie, and returns unified cart.

#### Authentication
- Required: `Authorization: Bearer <jwt_token>`
- Cookie: `phanilie_guest_session=<guid>`

#### Response `200 OK`
```json
{
  "synced": true,
  "mergedItemCount": 2,
  "cart": {
    "totalItemCount": 2,
    "subtotalIDR": 300000.0,
    "subtotalUSD": 19.98,
    "currency": "IDR",
    "hasPriceAdjustments": false,
    "items": []
  }
}
```
Header: `Set-Cookie: phanilie_guest_session=; Max-Age=0; Path=/; HttpOnly`

#### Response `500 Internal Server Error` (Non-blocking retry trigger)
```json
{
  "error": "SyncFailed",
  "message": "Cart synchronization failed. Guest session preserved for retry."
}
```
*(Client keeps guest session cookie intact and retries on subsequent page loads).*
