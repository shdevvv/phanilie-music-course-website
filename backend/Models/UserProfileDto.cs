namespace BackendAPI.Models
{
    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string SkillLevel { get; set; } = "Intermediate";
        public List<string> PreferredGenres { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }

    public class SubscriptionOverviewDto
    {
        public string PlanName { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
        public DateTime RenewalDate { get; set; }
        public decimal PriceIDR { get; set; }
        public decimal PriceUSD { get; set; }
        public bool IsActive { get; set; }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
