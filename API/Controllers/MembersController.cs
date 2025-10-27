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
    public class MembersController(IMemberRepository memberRepository
    ,IPhotoService photoService) : BaseApiController
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
        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Invalid member");
            var result = await photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };
            if (member.ImaageUrl == null)
            {
                member.ImaageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);
            if (await memberRepository.SaveAllAsync())
            {
                return photo;
            }
            return BadRequest("Problem adding photo");
        }
        [HttpDelete("delete-photo/{publicId}")]
        public async Task<ActionResult<Photo>> DeletePhoto(int publicId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Invalid member");
            var photo = member.Photos.FirstOrDefault(x => x.Id == publicId);
            if (photo == null) return BadRequest("Invalid photo");
            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            member.Photos.Remove(photo);
            if (photo.Url == member.ImaageUrl)
            {
                member.ImaageUrl = member.Photos.FirstOrDefault()?.Url;
                member.User.ImageUrl = member.ImaageUrl;
            }
            if (await memberRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem deleting photo");
        }
        [HttpPut("setmainphoto/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Invalid member");
            var photo = member.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();
            //if(member.ImaageUrl == photo.Url ||photo==null) return BadRequest("This is already your main photo");
            member.User.ImageUrl = photo.Url;
            member.ImaageUrl = photo.Url;
            if (await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Problem setting main photo");
        }
    }
}
