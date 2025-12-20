using System;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController (ILikesRepository likesRepository):BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult>ToggleLike(string targetMemberId)
    {
        var sourceMemberId=User.GetMemberId();
        if(sourceMemberId==targetMemberId)return BadRequest("you cannot like yourself");
        var existingLike=await likesRepository.GetMembeLike(sourceMemberId,targetMemberId);
        if(existingLike!=null) {       
             likesRepository.DeleteLike(existingLike);
        }
        else
        {
            var memberLike=new Entities.MemberLike
            {
                SourceMemberId=sourceMemberId,
                TargetMemberId=targetMemberId
            };
            likesRepository.AddLike(memberLike);
            
        }
        if(await likesRepository.SaveAllAsync()) return Ok();
        return BadRequest("failed to like member");
    }
    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        return Ok(await likesRepository.GetCurrentMemberLikeIds(User.GetMemberId()));
    }
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>>GetMemberLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.memberId=User.GetMemberId();
        var members =await likesRepository.GetMembeLikes(likesParams);
        return Ok(members);
    }
}
