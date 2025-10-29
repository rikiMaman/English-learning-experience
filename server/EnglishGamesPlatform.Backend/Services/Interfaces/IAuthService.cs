using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.Entities;

namespace EnglishGamesPlatform.Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Response<UserResponse>> Login(LoginDto user);
        Task<Response<UserResponse>> Register(RegisterDTO user);
        Task<Response<UserResponse>> GoogleLogin(string idToken);
    }
}
