using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class IndicadoresCHController : ApiController
    {
        indicadoresCHRepositoy _irep;

        private static readonly ILog log = LogManager.GetLogger(typeof(IndicadoresCHController));

        public IndicadoresCHController() {
            _irep = new indicadoresCHRepositoy();
        }


        [HttpGet]
        public async Task<IHttpActionResult> getActualizacionesPeriodo(String id)
        {
            try
            {
                var obj = await _irep.actualizacionesPeriodo(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
