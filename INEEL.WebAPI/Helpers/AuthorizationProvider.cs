using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.Repositories;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace INEEL.WebAPI.Helpers
{
    public class AuthorizationProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            AccesoSistema user;
            try
            {
                using (AccesoSistemaRepository _repo = new AccesoSistemaRepository())
                {
                    user = await _repo.FindUser(context.UserName, context.Password);

                    if (user == null)
                    {
                        context.SetError("invalid_grant", "Usuario o contraseña incorrecta");
                        return;
                    }
                }
            }
            catch (Exception e)
            {
                context.SetError(e.Message);
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim("userName", context.UserName)); //TODO logger
            identity.AddClaim(new Claim("id", user.AccesoID.ToString()));
            identity.AddClaim(new Claim("sub", context.UserName));
            identity.AddClaim(new Claim("role", "user"));
            identity.AddClaim(new Claim("ip", this.GetIPServerVariables()));

            context.Validated(identity);
            var p = new Personas();
            p.ClavePersona = user.ClavePersona;
            p.Nombre = user.UserName;
            
            SimpleSessionPersister.PersonaId= p.ClavePersona; //HttpContext.Current.User.Identity.Name;
            SimpleSessionPersister.nombreUsuario= user.UserName;

            BitacoraSISTEMA.InsertaLogin(p, true, this.GetIP());
        }
        public DatosCliente GetIP()
        {
            DatosCliente cli = new DatosCliente();
            try
            {
                string ip = null;
                ip = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (string.IsNullOrEmpty(ip))
                {
                    ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                else { // Using X-Forwarded-For last address
                    ip = ip.Split(',')
                           .Last()
                           .Trim();
                }
                cli.RemoteAddr = ip;
                var ipClient = HttpContext.Current.Request.ServerVariables["HTTP_CLIENT_IP"];
                cli.ClientIP = ipClient;
                var host = HttpUtility.HtmlEncode(HttpContext.Current.Request.UserHostAddress);
                cli.HostAddr = host;
            }
            catch (Exception e)
            {

            }
            return cli;
        }

        private String GetIPServerVariables()
        {
            string ip = null;
            try
            {

                ip = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (string.IsNullOrEmpty(ip))
                {
                    ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
                else { // Using X-Forwarded-For last address
                    ip = ip.Split(',')
                           .Last()
                           .Trim();
                }
                if (string.IsNullOrEmpty(ip))
                {
                    ip = HttpContext.Current.Request.ServerVariables["HTTP_CLIENT_IP"];
                }
                return ip;
            }
            catch (Exception e)
            {
                return ip;
            }
        }
    }
}
