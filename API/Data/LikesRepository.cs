using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Helpers;
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

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
        var users = _dataContext.Users.OrderBy(u => u.UserName).AsQueryable();
        var likes = _dataContext.Likes.AsQueryable();

        if (likesParams.Predicate == "liked")
        {
            likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
            users = likes.Select(like => like.TargetUser);
        }
        if (likesParams.Predicate == "likedBy")
        {
            likes = likes.Where(like => like.TargetUserId == likesParams.UserId);
            users = likes.Select(like => like.SourceUser);
        }

        var likesUsers = users.Select(user => new LikeDto
        {
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
            City = user.City,
            Id = user.Id
        });

        return await PagedList<LikeDto>.CreateAsync(likesUsers, likesParams.pageNumber, likesParams.pageSize);
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
        return await _dataContext.Users
        .Include(user=> user.LikedByUsers)
        .FirstOrDefaultAsync(user => user.Id == userId);
    }
}
