using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(AppDbContext context,ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            using var hmac = new HMACSHA512();
            if (await emailExists(registerDto.Email))
            {
                return BadRequest("Email is already taken");
            }
            var user = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return user.ToDto(tokenService);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email);
            if (user == null) return Unauthorized("Invalid email");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            if (!computedHash.SequenceEqual(user.PasswordHash)) return Unauthorized("Invalid password");
            return user.ToDto(tokenService);

        }
        private async Task<bool> emailExists(string email)
        {
            return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
    }
}
