using System;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AdminController (UserManager<AppUser> userManager):BaseApiController
{
[Authorize(Policy ="RequiredAdminRole")]
[HttpGet("users-with-roles")]
public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = userManager.Users.ToList();
        var userList=new List<object>();
        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);

            var userss= await userManager.GetUserNameAsync(user);
            userList.Add(new
            {
                user.Id,userss,
               email= user.UserName,
                Roles = roles.ToList()
            });
        }
        return Ok(userList);
    }
    [Authorize(Policy ="RequiredAdminRole")]
    [HttpPost("edit-roles/{userid}")]
    public async Task<ActionResult<IList<string>>> EditRoles(string userid,[FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
        var user = await userManager.FindByIdAsync(userid);
        if (user == null) return NotFound("User not found");
        var selectedRoles = roles.Split(",").ToArray();
        var userRoles = await userManager.GetRolesAsync(user);
        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Failed to add roles");
        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded) return BadRequest("Failed to remove roles");
        return Ok(await userManager.GetRolesAsync(user));
    }
    [Authorize(Policy ="ModeratePhotoRole")]
[HttpGet("photos-to-moderate")]
public ActionResult GetPhotosWithRoles()
    {
        return Ok("moderator or  admins can see this");
    }
}
