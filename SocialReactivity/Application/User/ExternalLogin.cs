using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.User.Model;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class ExternalLogin
    {

        public class Query : IRequest<User>
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IFacebookAccessor _facebookAccessor;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(UserManager<AppUser> userManager, IFacebookAccessor facebookAccessor, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _facebookAccessor = facebookAccessor;
                _userManager = userManager;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInfo = await _facebookAccessor.FacebookLogin(request.AccessToken);

                if (userInfo == null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem validation token" });
                }

                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                if (user == null)
                {
                    user = new AppUser
                    {
                        Id = userInfo.Id,
                        DisplayName = userInfo.Name,
                        Email = userInfo.Email,
                        UserName = "fb_" + userInfo.Id
                    };
                    var photo = new Photo
                    {
                        Id = "fb_" + userInfo.Id,
                        IsMain = true,
                        Url = userInfo.Picture.Data.Url
                    };
                    user.Photos.Add(photo);

                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        throw new RestException(HttpStatusCode.BadRequest, new {User = "Problem creating user"});
                    }
                }

                return new User {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
                };
            }
        }

    }
}