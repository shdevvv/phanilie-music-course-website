# Data Model: Core Database Infrastructure & Initial Data Seeding

## Entities & Schemas

### 1. User (`Users` Table)

Represents system user accounts, storing authentication credentials, roles, and localization preferences.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `Id` | `Guid` | Primary Key, Non-null | Unique identifier for the user account. |
| `Email` | `string` | Unique Index, Required | User email address (e.g., `admin@phanilie.com`). |
| `PasswordHash` | `string` | Required | BCrypt-hashed password string. |
| `FullName` | `string` | Required | Display name of the user. |
| `Role` | `UserRole` (Enum) | Required | Role enum (`Admin`, `Subscriber`, `Student`). |
| `CountryCode` | `string` | ISO 2-letter, Optional | Default country code (e.g., `ID`, `US`). |
| `CurrencyPreference`| `string` | Optional | Currency preference (`IDR`, `USD`). |
| `CreatedAt` | `DateTimeOffset` | Required | UTC timestamp when account was created. |
| `UpdatedAt` | `DateTimeOffset` | Required | UTC timestamp when account was last modified. |

---

### 2. MembershipPlan (`MembershipPlans` Table)

Represents subscription plan definitions with dual-currency pricing options.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `Id` | `Guid` | Primary Key, Non-null | Unique identifier for the plan tier. |
| `Name` | `string` | Unique Index, Required | Plan tier title (`Monthly`, `Quarterly`, `Annual`). |
| `Description` | `string` | Required | Plan feature description summary. |
| `Price_IDR` | `decimal` | Precision(18,2), Required | Subscription price in Indonesian Rupiah (IDR). |
| `Price_USD` | `decimal` | Precision(18,2), Required | Subscription price in US Dollars (USD). |
| `DurationMonths` | `int` | Required, >0 | Subscription billing cycle duration in months (1, 3, 12). |
| `IsActive` | `bool` | Default `true` | Availability status for user subscription purchase. |
| `CreatedAt` | `DateTimeOffset` | Required | UTC timestamp of plan creation. |

---

### 3. Badge (`Badges` Table)

Represents system achievement badge definitions for student gamification.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `Id` | `Guid` | Primary Key, Non-null | Unique identifier for the achievement badge. |
| `Title` | `string` | Unique Index, Required | Badge title (`First Song Mastered`, etc.). |
| `Description` | `string` | Required | Unlocking criteria or description. |
| `IconUrl` | `string` | Required | Static asset URL or reference path for badge icon. |
| `RequirementThreshold`| `int` | Required | Numeric milestone threshold required to earn badge. |
| `CreatedAt` | `DateTimeOffset` | Required | UTC timestamp of badge creation. |

---

## Seed Data Pre-conditions

### Default Super Admin Record
- **Email**: `admin@phanilie.com`
- **PasswordHash**: BCrypt hash of `Admin@Phanilie2026!`
- **FullName**: `System Administrator`
- **Role**: `Admin`

### Default Membership Plans
1. **Monthly**: 149,000 IDR / $9.99 USD (Duration: 1 month)
2. **Quarterly**: 399,000 IDR / $26.99 USD (Duration: 3 months)
3. **Annual**: 1,299,000 IDR / $89.99 USD (Duration: 12 months)

### Default System Badges
1. **First Song Mastered**: Awarded for completing 1 score/masterclass. (Threshold: 1)
2. **Dedicated Learner**: Awarded for completing 5 practice sessions. (Threshold: 5)
3. **Practice Enthusiast**: Awarded for 10 hours of active learning. (Threshold: 10)
4. **Weekly Warrior**: Awarded for 7 consecutive days of practice. (Threshold: 7)
