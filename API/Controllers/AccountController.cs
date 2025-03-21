﻿using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper; 

    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
    {
         
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    [HttpPost("register")]  //POST api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("The username is taken");
        
        var user = _mapper.Map<AppUser>(registerDto);
       
        
        user.UserName = registerDto.Username.ToLower();
        
        var result = await _userManager.CreateAsync(user, registerDto.Password);
        
        if (!result.Succeeded) return BadRequest(result.Errors);

        var roleResult = await _userManager.AddToRoleAsync(user, "Member");
        
        return new UserDto
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }


    [HttpPost("login")]  //POST api/account/login
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users.
        Include(p => p.Photos).
        SingleOrDefaultAsync(user=>user.UserName == loginDto.Username);
        
        if (user==null) return Unauthorized("invalid username");

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!result) return Unauthorized();
        return new UserDto
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };

    }
    private async Task<bool> UserExists(string username) => await _userManager.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
}
