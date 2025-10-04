using System;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        if (await context.Members.AnyAsync()) return;
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
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImaageUrl,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
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
            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}
