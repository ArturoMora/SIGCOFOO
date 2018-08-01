using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT
{
    public class CountSolicitudesMTController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CountSolicitudesMTController));
        private SolicitudInsumoRepository dbInsumo;
        public CountSolicitudesMTController()
        {
            dbInsumo = new SolicitudInsumoRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll(String id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                InformeTFRepository itf = new InformeTFRepository();
                var countInsumos = await dbInsumo.CountGetByClave(id);
                var countITF = await itf.CountITFrevisionByResponsable(id);
                var result = new {
                    insumos =countInsumos,
                    itfs= countITF
                };
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
