using System;
using System.Net;
using System.Text.Json;

namespace API.Middleware;

public class ExceptionMiddleware(RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            logger.LogError(ex, "{Message}", ex.Message);
            context.Request.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            var Response=env.IsDevelopment()
                ? new Errors.ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new Errors.ApiException(context.Response.StatusCode, "Internal Server Error");
            var options = new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(Response, options);
            await context.Response.WriteAsync(json);
        }

    }
}
