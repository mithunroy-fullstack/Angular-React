using Microsoft.AspNetCore.Identity;

namespace AuthService.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Add custom properties if needed
        public string FullName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
