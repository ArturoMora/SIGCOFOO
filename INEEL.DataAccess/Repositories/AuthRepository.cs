using INEEL.DataAccess.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.Dataccess.Contexts.Identity;

namespace INEEL.DataAccess.Repositories
{
    public class AuthRepository : IDisposable
    {
        private AuthContext _ctx;
        private UserManager<IdentityUser> _userManager;
        public AuthRepository()
        {
            _ctx = new AuthContext();
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }
        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();
        }


        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            try
            {
                IdentityUser user = new IdentityUser
                {
                    UserName = userModel.UserName
                };

                var result = await _userManager.CreateAsync(user, userModel.Password);

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);

            return user;
        }


    }
}