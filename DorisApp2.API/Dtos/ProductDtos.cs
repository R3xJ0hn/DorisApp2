using System.ComponentModel.DataAnnotations;

namespace DorisApp2.API.Dtos
{
    public class ProductResponse
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class ProductRequest
    {
        [Required]
        public int CategoryId { get; set; }

        public int? SubCategoryId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(180)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Range(0, 9999999999999999.99)]
        public decimal Price { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
