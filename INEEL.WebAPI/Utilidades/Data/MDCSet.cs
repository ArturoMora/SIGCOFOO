using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http.Routing;

namespace INEEL.WebAPI.Utilidades.Data
{
    public class MDCSet
    {
        private string fullAction { get; set; }
        private string getUserName(ClaimsPrincipal principal)
        {
            string r = null;
            if (null != principal)
            {
                var claim = principal.Claims.FirstOrDefault(x => x.Type == "userName");
                if (claim != null)
                {
                    r = claim.Value;
                }
            }
            if (String.IsNullOrEmpty(r))
            {
                try
                {
                    r = HttpContext.Current.Request.Headers.Get("userName");
                }
                catch (Exception e) { }
            }
            return r;
        }
        private string getIP(ClaimsPrincipal principal)
        {
            string r = null;
            if (null != principal)
            {
                var claim = principal.Claims.FirstOrDefault(x => x.Type == "ip");
                if (claim != null)
                {
                    r = claim.Value;
                }
            }
            if (String.IsNullOrEmpty(r))
            {
                try
                {
                    r = this.GetIPServerVariables();
                    //r = HttpContext.Current.Request.Headers.Get("ip");

                }
                catch (Exception e) { }
            }
            return r;
        }
        public MDCSet(IHttpRouteData routeData) {
            fullAction = null;
            try {                
                ClaimsPrincipal principal = HttpContext.Current.User as ClaimsPrincipal;
                var userName = this.getUserName(principal);
                var userIP = this.getIP(principal);
                MDC.Set("userName", userName); //usuario que se logea
                MDC.Set("ip", userIP);
                string actionName = routeData.Values["action"].ToString();
                string controller = routeData.Values["controller"].ToString();
                string requestType = HttpContext.Current.Request.RequestType;

                fullAction = String.Concat(requestType, "-", controller, "-", actionName);
                MDC.Set("fullAction", fullAction);
              }
            catch(Exception e){}
            
        }
        public override string ToString()
        {
            return fullAction;
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