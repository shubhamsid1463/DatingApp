using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberAsync(string id)
    {
        return await context.Members
        .FindAsync(id);
    }


    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.Include(u => u.User).AsQueryable();
        query = query.Where(X => X.Id != memberParams.CurrentMemberId);
        if (memberParams.Gender != null)
        {
            query = query.Where(x => x.Gender.ToLower() == memberParams.Gender.ToLower());
        }
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge-1));
        var MaxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= MaxDob);
        // query = query.OrderByDescending(x => x.DateOfBirth);
        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };
        return await PaginationHelper.CreateAsync(query,
          memberParams.PageSize,memberParams.PageNumber);

        // await context.Members
        // .Include(u => u.User)
        //     .Include(p => p.Photos)
        // .ToListAsync();
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members
            .Where(x => x.Id == memberId)
            .SelectMany(x => x.Photos)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
    
    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members
            .Include(u => u.User)
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }
}
