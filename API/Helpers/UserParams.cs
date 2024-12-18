using System;
using System.Reflection.Metadata.Ecma335;

namespace API.Helpers;

public class UserParams
{
    private const int MaxPageSize = 40;
    public int pageNumber {get;set;} = 1;

    private int _pageSize = 10;

    public int pageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize: value;
        
    }

    public string CurrentUsername{get;set;}
    public string Gender{get;set;}

    public int MinAge {get;set;} = 28;

    public int MaxAge {get;set;} = 100;

    public string OrderBy {get;set;} = "lastActive";
    
}
