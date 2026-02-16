using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(UserManager<AppUser> userManager,ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    Gender = registerDto.Gender,
                    City = registerDto.City,
                    Country = registerDto.Country,
                    Email=registerDto.Email,
                    DateOfBirth = registerDto.DateOfBirth
                }
            };
            var result =await userManager.CreateAsync(user,registerDto.Password);
            if (!result.Succeeded){
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                 return ValidationProblem();}
            await userManager.AddToRoleAsync(user, "Member");
            await setRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized("Invalid email");
            var result=await userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result) return Unauthorized("Invalid password");
            await setRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken)) return NoContent();
            var user = await userManager.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null || user.RefreshTokenExpiry <= DateTime.Now) return Unauthorized("Invalid or expired refresh token");
            await setRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }
        private async Task setRefreshTokenCookie(AppUser user)
        {
            var refreshToken=tokenService.GenerateToken();
            user.RefreshToken=refreshToken;
            user.RefreshTokenExpiry=DateTime.Now.AddDays(7);
            await userManager.UpdateAsync(user);
            var cookieOptions=new CookieOptions
            {
                HttpOnly=true,
                Secure=true,
                SameSite=SameSiteMode.Strict,
                Expires=user.RefreshTokenExpiry
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

    }
}
