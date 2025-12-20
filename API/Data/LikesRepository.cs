using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike memberLike)
    {
        context.Likes.Add(memberLike);
    }

    public void DeleteLike(MemberLike memberLike)
    {
        context.Likes.Remove(memberLike);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        var QueryContext= context.Likes.AsQueryable();
        return await QueryContext
            .Where(like => like.SourceMemberId == memberId)
            .Select(like => like.TargetMemberId)
            .ToListAsync();
    }

    public async Task<MemberLike?> GetMembeLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMembeLikes(LikesParams likesParams)
    {
       var likes = context.Likes.AsQueryable();
       IQueryable<Member> result;
       switch (likesParams.predicate)
       {
           case "liked":
                  result= likes
                    .Where(member => member.SourceMemberId == likesParams.memberId)
                    .Select(like => like.TargetMember);
                    break;
           case "likedBy":
                result=  likes
                    .Where(member => member.TargetMemberId == likesParams.memberId)
                    .Select(like => like.SourceMember);
                    break;
              default:
                  var likeIds=await GetCurrentMemberLikeIds(likesParams.memberId);
                  result=likes
                    .Where(member => member.TargetMemberId==likesParams.memberId&&likeIds.Contains(member.SourceMemberId))
                    .Select(like => like.SourceMember);
                    break;
       }
       return await PaginationHelper.CreateAsync(result, likesParams.PageSize,likesParams.PageNumber );
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
