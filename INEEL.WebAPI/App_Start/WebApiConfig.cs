using INEEL.WebAPI.Helpers;
using Newtonsoft.Json.Serialization;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;

namespace INEEL.WebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            // Add handler to deal with preflight requests, this is the important part
            config.MessageHandlers.Add(new PreflightRequestsHandler());

            // No-Cache filter
            config.Filters.Add(new NoCacheHeaderFilter());

            // Configuración y servicios de API web
            config.EnableCors(new EnableCorsAttribute("*", "*", "*")); // origins, headers, methods

            // Rutas de API web
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApiActions",
                routeTemplate: "api/{controller}/{action}/{id}/{clave}",
                defaults: new { id = RouteParameter.Optional, clave= RouteParameter.Optional }
            );

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    }
}