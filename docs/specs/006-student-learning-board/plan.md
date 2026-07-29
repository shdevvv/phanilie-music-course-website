# Technical Implementation Plan: SPEC-006 Student Learning Board & Gamification

**Module Directory**: `docs/specs/006-student-learning-board`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices

* **Backend**: ASP.NET Core 10 Web API (`ProgressController.cs`, `TodoController.cs`).
* **Badge Trigger Engine**: `BadgeEvaluatorService.cs` evaluating milestone logic.
* **Frontend**: React Dashboard with custom charts and modal celebration components.

---

## 2. Codebase Architecture & Folder Structure

```text
backend/
├── Controllers/
│   ├── ProgressController.cs          # Progress & practice log endpoints
│   └── TodoController.cs              # To-Do list CRUD endpoints
├── Services/Implementations/
│   └── BadgeEvaluatorService.cs       # Milestone threshold checker
├── Models/
│   ├── StudentProgress.cs
│   ├── StudentTodo.cs
│   ├── Badge.cs
│   └── UserBadge.cs
```

---

## 3. Badge Auto-Trigger Logic

```csharp
public async Task<List<Badge>> EvaluateBadgesAsync(int userId)
{
    var unlockedBadges = new List<Badge>();
    var totalLessons = await _context.StudentProgress.CountAsync(p => p.UserId == userId && p.IsCompleted);
    var totalMinutes = await _context.StudentProgress.Where(p => p.UserId == userId).SumAsync(p => p.PracticeMinutes);

    // Evaluate Lesson Thresholds
    if (totalLessons >= 5 && !await HasBadgeAsync(userId, "Dedicated Learner"))
        unlockedBadges.Add(await AwardBadgeAsync(userId, "Dedicated Learner"));

    // Evaluate Minute Thresholds
    if (totalMinutes >= 100 && !await HasBadgeAsync(userId, "Practice Enthusiast"))
        unlockedBadges.Add(await AwardBadgeAsync(userId, "Practice Enthusiast"));

    return unlockedBadges;
}
```

---

## 4. Implementation Roadmap

1. **Step 1**: Create `StudentProgress`, `StudentTodo`, `Badge`, and `UserBadge` models.
2. **Step 2**: Build `ProgressController` and `TodoController`.
3. **Step 3**: Implement `BadgeEvaluatorService`.
4. **Step 4**: Build React Learning Board dashboard page.
