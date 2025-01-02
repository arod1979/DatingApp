using System;
using System.Reflection.Metadata.Ecma335;

namespace API.Helpers;

public class UserParams: PaginationParams
{


    public string CurrentUsername{get;set;}
    public string Gender{get;set;}

    public int MinAge {get;set;} = 28;

    public int MaxAge {get;set;} = 100;

    public string OrderBy {get;set;} = "lastActive";
    
}
