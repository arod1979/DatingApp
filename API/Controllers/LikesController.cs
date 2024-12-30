using System;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController: BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly ILikesRepository _likesRepository;
    
    public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
    {
        _userRepository = userRepository;
        _likesRepository = likesRepository;
    }

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        //var sourceUserId = User.GetUserId();
        var sourceUser= await _userRepository.GetUserByUsernameAsync(User.GetUserName());
        var sourceUserId = sourceUser.Id ;
        var likedUser = await _userRepository.GetUserByUsernameAsync(username);
        //var sourceUser =  await _likesRepository.GetUserWithLikes(sourceUserId);
        if (likedUser==null) return NotFound();
        if (sourceUser.UserName == username) return BadRequest("You cannot like yourself");
        var userLike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);
        if (userLike !=null) return BadRequest("You already like this user");
        userLike = new Entities.UserLike{
            SourceUserId = sourceUserId,
            TargetUserId = likedUser.Id
        };
        sourceUser.UsersILiked.Add(userLike);
        if (await _userRepository.SaveAllAsync()) return Ok();
        return BadRequest("Failed to like user");




    }


}
