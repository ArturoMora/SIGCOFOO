using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INEEL.WebAPI.Utilidades
{
    public class ServerVariables
    {
        public async Task<DatosCliente> GetIPasync()
        {
            DatosCliente cli = new DatosCliente();
            await Task.Run(() =>
            {
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
            }
            );
            return cli;
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
    }
}