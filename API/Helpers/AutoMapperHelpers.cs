using System;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperHelpers: Profile
{
    public AutoMapperHelpers()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(d => d.PhotoUrl, o =>
            o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<Photo, PhotoDto>();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto,AppUser>();
        CreateMap<Message,MessageDto>()
            .ForMember(d => d.SenderPhotoUrl, o => 
            o.MapFrom(s =>s.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(d => d.RecipientPhotoUrl, 
            o => o.MapFrom(s =>s.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));

    }
}
