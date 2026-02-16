using System;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/Member.Json");
        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);
        if (members == null)
        {
            Console.WriteLine("No members found in the JSON file.");
            return;
        }
        foreach (var member in members)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            var user = new AppUser
            {
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImaageUrl,
                UserName = member.Email,
                Member = new Member
                {
                    Email = member.Email,
                    DateOfBirth = member.DateOfBirth,
                    ImaageUrl = member.ImaageUrl,
                    DisplayName = member.DisplayName,
                    Created = member.Created,
                    LastActive = member.LastActive,
                    Description = member.Description,
                    Gender = member.Gender,
                    City = member.City,
                    Country = member.Country
                }
            };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImaageUrl!,
                PublicId = "seed_photos"
            });
         var result = await userManager.CreateAsync(user, "Pa$$w0rd");
         if (!result.Succeeded)
         {
             Console.WriteLine($"Failed to create user {user.UserName}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
         }
         await userManager.AddToRoleAsync(user, "Member");
        }
        var admin = new AppUser
        {
            UserName = "admin@text.com",
            DisplayName = "Admin",
            Email = "admin@text.com"  
        };
        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, new List<string> {"Admin","Moderator"});
    }
}
