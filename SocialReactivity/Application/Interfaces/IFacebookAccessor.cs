using System.Threading.Tasks;
using Application.User.Model;

namespace Application.Interfaces
{
    public interface IFacebookAccessor
    {
         Task<FacebookUserInfo> FacebookLogin(string accessToken);
    }
}