using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository : ILikesRepository
{
    private readonly DataContext _dataContext;

    public LikesRepository(DataContext context)
    {
        this._dataContext = context;
    }
    
    public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await _dataContext.Likes.FindAsync(sourceUserId,targetUserId);
    }

    public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
    {
        var users = _dataContext.Users.OrderBy(u => u.UserName).AsQueryable();
        var likes = _dataContext.Likes.AsQueryable();

        if (predicate == "liked")
        {
            likes = likes.Where(like => like.SourceUserId == userId);
            users = likes.Select(like => like.TargetUser);
        }
        if (predicate == "likedBy")
        {
            likes = likes.Where(like => like.TargetUserId == userId);
            users = likes.Select(like => like.SourceUser);
        }

        return await users.Select(user => new LikeDto
        {
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
            City = user.City,
            Id = user.Id
        }).ToListAsync();
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
        return await _dataContext.Users
        .Include(user=> user.LikedByUsers)
        .FirstOrDefaultAsync(user => user.Id == userId);
    }
}
