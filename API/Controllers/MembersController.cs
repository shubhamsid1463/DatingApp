using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]//localhost:5000/api/members
    [ApiController]
    public class MembersController(AppDbContext context) : ControllerBase
    {
        // GET: api/members
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await context.Users.ToListAsync();
            return members;
        }
        [HttpGet("{id}")]//localhost:5000/api/members/{id}
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member =await context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (member == null) return NotFound();
            return member;
        }
    }
}
