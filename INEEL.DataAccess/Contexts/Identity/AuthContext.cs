using Microsoft.AspNet.Identity.EntityFramework;

namespace INEEL.Dataccess.Contexts.Identity
{
    public class AuthContext : IdentityDbContext<IdentityUser>
    {
        public AuthContext()
            : base("ContextAuth", throwIfV1Schema: false)
        {

        }

    }
}
