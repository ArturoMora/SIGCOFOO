using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.WebAPI.Utilidades;
using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class TunelBitacoraController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TunelBitacoraController));
        
        [HttpGet]
        public async Task<IHttpActionResult> InsertaLogOff(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var x = HttpContext.Current;

                var datosCliente = await new ServerVariables().GetIPasync();
               // BitacoraSISTEMA.InsertaLogOff(datosCliente);
                return Ok("ok");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
