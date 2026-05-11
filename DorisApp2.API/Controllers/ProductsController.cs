using DorisApp2.API.Dtos;
using DorisApp2.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DorisApp2.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<ProductResponse>>> GetProducts()
    {
        return Ok(await productService.GetProductsAsync());
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductResponse>> GetProduct(int id)
    {
        var product = await productService.GetProductAsync(id);

        if (product is null)
        {
            return NotFound(new { message = "Product was not found." });
        }

        return Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductResponse>> CreateProduct(ProductRequest request)
    {
        var result = await productService.CreateProductAsync(request);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return CreatedAtAction(nameof(GetProduct), new { id = result.Value!.Id }, result.Value);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductResponse>> UpdateProduct(int id, ProductRequest request)
    {
        var result = await productService.UpdateProductAsync(id, request);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return Ok(result.Value);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await productService.DeleteProductAsync(id);

        if (!result.Succeeded)
        {
            return ToErrorResult(result);
        }

        return NoContent();
    }

    private ActionResult ToErrorResult(IServiceResult result)
    {
        return result.Error switch
        {
            ServiceError.BadRequest => BadRequest(new { message = result.Message }),
            ServiceError.NotFound => NotFound(new { message = result.Message }),
            ServiceError.Conflict => Conflict(new { message = result.Message }),
            _ => BadRequest(new { message = result.Message ?? "Unable to complete product request." })
        };
    }
}
