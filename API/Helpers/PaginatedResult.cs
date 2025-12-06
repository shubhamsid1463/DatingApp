using System;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginatedMetadata Metadata { get; set; } = default!;
    public List<T> Items { get; set; } = [];
}

public class PaginatedMetadata
{
    public int PageSize { get; set; }
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int TotalCount { get; set; }
};
public class PaginationHelper
{

public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query,
          int PageSize,int PageNumber)
    {
    var count = await query.CountAsync();
    var items = await query.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToListAsync();
    return new PaginatedResult<T>
    {
        Metadata = new PaginatedMetadata
        {
            PageSize = PageSize,
            CurrentPage = PageNumber,
            TotalPages = (int)Math.Ceiling(count / (double)PageSize),
            TotalCount = count
        },
        Items = items
    };
 
    }
}