using System.ComponentModel.DataAnnotations;

namespace DorisApp2.API.Utilities
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter)]
    public sealed class LucideIconNameAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
            {
                return ValidationResult.Success;
            }

            if (value is not string iconName)
            {
                return new ValidationResult("Icon name must be a string.");
            }

            if (string.IsNullOrWhiteSpace(iconName) || LucideIconNames.All.Contains(iconName))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult($"'{iconName}' is not a valid Lucide icon name.");
        }
    }
}
