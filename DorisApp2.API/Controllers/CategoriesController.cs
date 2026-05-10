using DorisApp2.API.Dtos;
using DorisApp2.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DorisApp2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<CategoryResponse>>> GetCategories()
    {
        return Ok(await categoryService.GetCategoriesAsync());
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
    {
        var category = await categoryService.GetCategoryAsync(id);

        if (category is null)
        {
            return NotFound(new { message = "Category was not found." });
        }

        return Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponse>> CreateCategory(CategoryRequest request)
    {
        var result = await categoryService.CreateCategoryAsync(request);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(nameof(GetCategory), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponse>> UpdateCategory(int id, CategoryRequest request)
    {
        var result = await categoryService.UpdateCategoryAsync(id, request);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await categoryService.DeleteCategoryAsync(id);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return NoContent();
    }

    [HttpPost("{categoryId:int}/subcategories")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubCategoryResponse>> CreateSubCategory(
        int categoryId,
        SubCategoryRequest request)
    {
        var result = await categoryService.CreateSubCategoryAsync(categoryId, request);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(nameof(GetCategory), new { id = categoryId }, result.Value);
    }

    [HttpPut("{categoryId:int}/subcategories/{subCategoryId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubCategoryResponse>> UpdateSubCategory(
        int categoryId,
        int subCategoryId,
        SubCategoryRequest request)
    {
        var result = await categoryService.UpdateSubCategoryAsync(categoryId, subCategoryId, request);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    [HttpDelete("{categoryId:int}/subcategories/{subCategoryId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSubCategory(int categoryId, int subCategoryId)
    {
        var result = await categoryService.DeleteSubCategoryAsync(categoryId, subCategoryId);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return NoContent();
    }

    private ActionResult ToErrorResult(ServiceResult result)
    {
        return result.Error switch
        {
            ServiceError.BadRequest => BadRequest(new { message = result.Message }),
            ServiceError.NotFound => NotFound(new { message = result.Message }),
            ServiceError.Conflict => Conflict(new { message = result.Message }),
            _ => BadRequest(new { message = result.Message ?? "Unable to complete category request." })
        };
    }
}
