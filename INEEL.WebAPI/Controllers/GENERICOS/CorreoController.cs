using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Util;
using System.Web.Script.Serialization;
using System.Text.RegularExpressions;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class CorreoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CorreoController));        
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> SendNotificacion(Correo correo)
        {
            try {
                MDC.Set("extraData", "Inicio de envío de correo:" + new JavaScriptSerializer().Serialize(correo));
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo      send = new SendCorreo();
                var result = await send.Send(correo, conf);

                if (!result)
                {
                    MDC.Set("extraData", "No se manda correo:" + new JavaScriptSerializer().Serialize(correo));
                    log.Warn(new MDCSet(this.ControllerContext.RouteData)); 

                }

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> SendNotificacionConCoautores(Correo correo)
        {
            try
            {
                MDC.Set("extraData", "Inicio de envío de correo:" + new JavaScriptSerializer().Serialize(correo));
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();
                var result = await send.Coautores(correo, conf);

                if (!result)
                {
                    MDC.Set("extraData", "No se manda correo:" + new JavaScriptSerializer().Serialize(correo));
                    log.Warn(new MDCSet(this.ControllerContext.RouteData));

                }

                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



    }
}
