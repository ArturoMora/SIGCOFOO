using INEEL.DataAccess.GEN.Util;
using log4net;
using System;
using System.Net.Http.Headers;
using System.Web.Http.Filters;
using System.Web;
using System.Web.Http.Controllers;
using System.Diagnostics;
using System.Net.Http;
using INEEL.WebAPI.Utilidades;
using System.Web.Script.Serialization;

namespace INEEL.WebAPI.Helpers
{
    public class NoCacheHeaderFilter : ActionFilterAttribute
    {
        //private static readonly ILog log = LogManager.GetLogger(typeof(NoCacheHeaderFilter));
        //private string usuarioId = "";
        //private Object args { get; set; }
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            
            //args = actionContext.ActionArguments;
            //usuarioId = SimpleSessionPersister.PersonaId;
        }
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response != null) // can be null when exception happens
            {
                actionExecutedContext.Response.Headers.CacheControl = new CacheControlHeaderValue { NoCache = true, NoStore = true, MustRevalidate = true };
                actionExecutedContext.Response.Headers.Pragma.Add(new NameValueHeaderValue("no-cache"));

                if (actionExecutedContext.Response.Content != null)  // can be null (for example HTTP 400)
                {
                    actionExecutedContext.Response.Content.Headers.Expires = DateTimeOffset.UtcNow;
                }

                //try
                //{


                //    if (!actionExecutedContext.Response.StatusCode.ToString().Equals("OK"))
                //    {
                //        LogException lg = new LogException();
                //        lg.user = usuarioId;
                //        try
                //        {
                //            lg.uri = actionExecutedContext.Request.RequestUri.AbsolutePath;
                //            lg.args = new JavaScriptSerializer().Serialize(args);
                //        }
                //        catch (Exception e) {

                //        }                        
                //        log.Debug(actionExecutedContext.Response.Content.ReadAsStringAsync().Result,
                //                new Exception(new JavaScriptSerializer().Serialize(lg)));
                //    }
                //}
                //catch (Exception e) { }

                //Escribe.Write("r1::" + actionExecutedContext.Response.StatusCode.ToString());
                //Escribe.Write("r::" + actionExecutedContext.Response.Content.ReadAsStringAsync().Result);
                //Escribe.Write("s::" + actionExecutedContext.Response.Content.ReadAsStringAsync().Status);
            }
        }
    }
}
