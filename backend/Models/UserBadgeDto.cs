namespace BackendAPI.Models
{
    public class UserBadgeDto
    {
        public int BadgeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedAt { get; set; }
        public int CurrentValue { get; set; }
        public int TargetValue { get; set; }
        public int ProgressPercentage { get; set; }
    }

    public class BadgeEvaluationResultDto
    {
        public List<UserBadgeDto> NewlyUnlockedBadges { get; set; } = new();
    }
}
