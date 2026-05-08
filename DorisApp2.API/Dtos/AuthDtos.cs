using System.ComponentModel.DataAnnotations;

namespace DorisApp2.API.Dtos
{
    public class RegisterRequest
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        [MaxLength(72)]
        public string Password { get; set; } = string.Empty;
    }
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(72)]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
