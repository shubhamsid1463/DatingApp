using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : BaseApiController
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }
    [HttpGet("hello")]
    public IEnumerable<WeatherForecast> Get()
    {
        string s1="5F3Z-2e-9-w";
        LicenseKeyFormatting(s1,3);
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            
        })
        .ToArray();
        
    }
    [HttpGet("data")]
    public IEnumerable<WeatherForecast> GetData(string s1,string s2)
    {
        string sample="9-w-5F3Z-2e";
        LicenseKeyFormatting(sample,3);
        int n = s1.Length, m = s2.Length;
        var dp = new int[n + 1, m + 1];

        // Base cases
        for (int i = 1; i <= n; i++)
            dp[i, 0] = dp[i - 1, 0] + s1[i - 1];

        for (int j = 1; j <= m; j++)
            dp[0, j] = dp[0, j - 1] + s2[j - 1];

        // Fill DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s1[i - 1] == s2[j - 1])
                    dp[i, j] = dp[i - 1, j - 1];
                else
                    dp[i, j] = Math.Min(
                        dp[i - 1, j] + s1[i - 1],
                        dp[i, j - 1] + s2[j - 1]
                    );
            }
        }

        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            
        })
        .ToArray();
    
    }
    public string LicenseKeyFormatting(string s, int k) {
        string [] str=s.Split('-');
        Array.Sort(str,(a,b)=>b.Length-a.Length);
        return "";
    }
    
}
