using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikesRepository
{   
    Task<UserLike> GetUserLike(int SourceUserId, int TargetUserId);

    Task<AppUser> GetUserWithLikes(int userId);

    Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);

}
