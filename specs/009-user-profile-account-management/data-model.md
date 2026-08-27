# Data Model: User Profile & Account Management

## Entities & DTOs

### 1. UserProfileDto
- **userId** (`integer`): Primary key.
- **name** (`string`): Display name.
- **email** (`string`): User email address.
- **avatarUrl** (`string`): Profile picture URL.
- **bio** (`string`): Musical biography & goals.
- **skillLevel** (`string`): `Beginner`, `Intermediate`, `Advanced`.
- **preferredGenres** (`string[]`): Array of genres (`Jazz`, `Classical`, `Pop`, `Gospel`).
- **createdAt** (`datetime`): Account registration timestamp.

### 2. SubscriptionOverviewDto
- **planName** (`string`): Membership tier name.
- **status** (`string`): `Active`, `Expired`, `Cancelled`.
- **renewalDate** (`datetime`): Billing renewal timestamp.
- **priceIDR** (`decimal`): Price in IDR.
- **priceUSD** (`decimal`): Price in USD.
- **isActive** (`boolean`): Active subscription flag.

### 3. ChangePasswordDto
- **currentPassword** (`string`): Existing password.
- **newPassword** (`string`): New password.
- **confirmPassword** (`string`): Confirmation password.
