using System.Threading.Tasks;
using Application.Profiles;
using Application.Profiles.Model;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new Details.Query {Username = username});
        }
    }
}