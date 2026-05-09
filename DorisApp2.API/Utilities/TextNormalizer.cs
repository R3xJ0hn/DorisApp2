namespace DorisApp2.API.Utilities
{
    public static class TextNormalizer
    {
        public static string? Required(string? value)
        {
            var trimmed = value?.Trim();
            return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
        }

        public static string? Optional(string? value)
        {
            var trimmed = value?.Trim();
            return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
        }

        public static string? Slug(string? value)
        {
            var normalizedSlug = value?.Trim().ToLowerInvariant();
            return string.IsNullOrWhiteSpace(normalizedSlug) ? null : normalizedSlug;
        }
    }
}
