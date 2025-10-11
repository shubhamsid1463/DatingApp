using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]//localhost:5000/api/members
    [ApiController]
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {
        // GET: api/members
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            var members = await memberRepository.GetMembersAsync();
            return Ok(members);
        }

        [HttpGet("{id}")]//localhost:5000/api/members/{id}
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotosForUser(string id)
        {
            var photos = await memberRepository.GetPhotosForMemberAsync(id);
            if (photos == null) return NotFound();
            return Ok(photos);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();            
            var member = await memberRepository.GetMemberForUpdate(memberId);
            if (member == null) return NotFound();
            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;
            //memberRepository.Update(member);//optional
            if (await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update member");
        }
    }
    
}
