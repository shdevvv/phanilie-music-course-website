# Data Model: Freemium Course Exploration

## Entities & DTOs

### 1. Course (Entity)
- **id** (`integer`): Primary key.
- **title** (`string`): Course name (e.g. "Gospel & Jazz Piano Foundations").
- **level** (`string`): Skill level classification ("Beginner", "Intermediate", "Advanced").
- **description** (`string`): Comprehensive summary of the course.
- **thumbnailUrl** (`string`): Header thumbnail image URL.
- **createdAt** (`datetime`): Timestamp of creation.

### 2. Topic (Entity)
- **id** (`integer`): Primary key.
- **courseId** (`integer`): Foreign key referencing `Course`.
- **title** (`string`): Module section title (e.g. "Module 1: 7th Chord voicings").
- **sequenceOrder** (`integer`): Display order within the course.

### 3. Lesson (Entity)
- **id** (`integer`): Primary key.
- **topicId** (`integer`): Foreign key referencing `Topic`.
- **title** (`string`): Lesson name.
- **summary** (`string`): Short summary of what is taught in the lesson.
- **videoUrl** (`string`): Protected video stream file path / URL.
- **pdfUrl** (`string`): Protected sheet music PDF file path / URL.
- **durationMinutes** (`integer`): Video duration in minutes.
- **sequenceOrder** (`integer`): Display order within the topic.

### 4. Public Course Tree DTOs
- **CourseTreeDto**: Includes Id, Title, Level, Description, ThumbnailUrl, and list of `TopicDto`.
- **TopicDto**: Includes Id, Title, SequenceOrder, and list of `LessonPublicDto`.
- **LessonPublicDto**: Includes Id, Title, Summary, DurationMinutes, SequenceOrder (NO videoUrl or pdfUrl).

### 5. LessonMediaResponseDto (Protected DTO)
- **lessonId** (`integer`): Lesson ID.
- **videoStreamUrl** (`string`): Temporary signed/authorized streaming endpoint.
- **pdfDownloadUrl** (`string`): Temporary signed PDF download endpoint.
