using INEEL.WebAPI.Helpers;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Web.Http;
using System.Data.Entity;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System.Configuration;
using log4net;

[assembly: OwinStartup("INEEL", typeof(INEEL.WebAPI.Startup))]
namespace INEEL.WebAPI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           
            HttpConfiguration config = new HttpConfiguration();
            ConfigureOAuth(app);
            WebApiConfig.Register(config);
            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
            Application_Start();
            //BasicConfigurator.Configure();
            //log4net.Config.XmlConfigurator.Configure();
        }
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            //Inicializa la base de datos
            Database.SetInitializer(new SISTEMA_Initializer(new DataAccess.GEN.Contexts.GEN_Context()));
            //Inicializar la bitácora de movimientos de usuarios del SISTEMA
            Boolean activaBitacora = true;
            if (ConfigurationManager.AppSettings["ActivarBitacora"].ToString() == "true")
            {
                activaBitacora = true;
            }
            else activaBitacora = false;

            var MongoDB= ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString;
            BitacoraSISTEMA.Inicializar(activaBitacora, MongoDB);
        }
        public void ConfigureOAuth(IAppBuilder app)
        {
            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new AuthorizationProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}