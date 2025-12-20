using System;

namespace API.Helpers;

public class LikesParams:PagingParams
{
    public string memberId { get; set; }="";
    public string predicate { get; set; }="liked";
}
