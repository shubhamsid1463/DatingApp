using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<MemberLike?> GetMembeLike(string sourceMemberId, string targetMemberId);
    Task<PaginatedResult<Member>> GetMembeLikes(LikesParams likesParams);
    Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
    void AddLike(MemberLike memberLike);
    void DeleteLike(MemberLike memberLike);
    Task<bool> SaveAllAsync();
}
