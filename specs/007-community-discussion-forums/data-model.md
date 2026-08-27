# Data Model: Community Discussion Forums

## Entities & DTOs

### 1. ForumThreadDto
- **id** (`integer`): Primary key.
- **authorName** (`string`): Post author's display name.
- **avatarUrl** (`string`): Author profile picture URL.
- **title** (`string`): Discussion thread title.
- **category** (`string`): `Technique`, `Repertoire`, `Equipment`, `General`.
- **content** (`string`): Main text body.
- **upvotes** (`integer`): Total upvote count.
- **repliesCount** (`integer`): Total replies count.
- **createdAt** (`datetime`): Timestamp of creation.
- **isUpvoted** (`boolean`): Whether current user upvoted this thread.

### 2. ForumReplyDto
- **id** (`integer`): Reply ID.
- **threadId** (`integer`): Target thread ID.
- **authorName** (`string`): Comment author display name.
- **avatarUrl** (`string`): Comment author avatar.
- **content** (`string`): Comment body text.
- **upvotes** (`integer`): Comment upvote count.
- **createdAt** (`datetime`): Timestamp of creation.

### 3. DTO Models
- **CreateThreadDto**: Title, Category, Content.
- **CreateReplyDto**: Content.
- **ReportThreadDto**: ThreadId, Reason (`Spam`, `Harassment`, `Inappropriate`).
