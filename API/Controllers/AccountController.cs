﻿using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper; 

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
    {
        _context = context;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    [HttpPost("register")]  //POST api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("The username is taken");
        
        var user = _mapper.Map<AppUser>(registerDto);
       
        
        user.UserName = registerDto.Username.ToLower();
        
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }


    [HttpPost("login")]  //POST api/account/login
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _context.Users.
        Include(p => p.Photos).
        SingleOrDefaultAsync(user=>user.UserName == loginDto.Username);
        
        if (user==null) return Unauthorized("invalid username");

        return new UserDto
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };

    }
    private async Task<bool> UserExists(string username) => await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
}
