using System.Threading.Tasks;
using Application.Profiles.Model;

namespace Application.Profiles.Interfaces
{
    public interface IProfileReader
    {
         Task<Profile> ReadProfile(string username);
    }
}