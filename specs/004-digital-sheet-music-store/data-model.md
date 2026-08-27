# Data Model: Digital Sheet Music Store & Library

## Entities & DTOs

### 1. SheetMusic (Entity)
- **id** (`integer`): Primary key.
- **title** (`string`): Song title (e.g. "Amazing Grace Gospel Arrangement").
- **composer** (`string`): Original composer name.
- **arranger** (`string`): Arrangement author (e.g. "Stephanie Halim").
- **difficulty** (`string`): `Beginner`, `Intermediate`, `Advanced`.
- **genre** (`string`): `Gospel`, `Jazz`, `Classical`.
- **keySignature** (`string`): Key (e.g. "Ab Major", "C Minor").
- **pageCount** (`integer`): Total number of pages.
- **priceIDR** (`decimal`): Localized IDR price.
- **priceUSD** (`decimal`): Localized USD price.
- **thumbnailUrl** (`string`): Score cover thumbnail.
- **previewPdfUrl** (`string`): Watermarked sample page 1.
- **fullPdfUrl** (`string`): Full high-resolution PDF score.

### 2. UserLibrary (Entity)
- **id** (`integer`): Primary key.
- **userId** (`integer`): Foreign key referencing `User`.
- **sheetMusicId** (`integer`): Foreign key referencing `SheetMusic`.
- **purchasedAt** (`datetime`): Ownership timestamp.

### 3. DTO Models
- **SheetMusicDto**: Includes Id, Title, Composer, Arranger, Difficulty, Genre, KeySignature, PageCount, PriceIDR, PriceUSD, ThumbnailUrl, IsOwned.
- **UserLibraryDto**: Includes LibraryId, SheetMusic (full details), PurchasedAt.
