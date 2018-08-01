using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class IndicadoresCRController : ApiController
    {
        indicadoresCRRepository _irep;

        private static readonly ILog log = LogManager.GetLogger(typeof(IndicadoresCRController));

        public IndicadoresCRController() {
            _irep = new indicadoresCRRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> getOportunidadesConcretadas(string id)
        {
            try
            {

                string[] parametros = id.Split(',');

                string anio = parametros[0];
                string periodo = parametros[1];
           

                var obj = await _irep.oportunidadesConcretadas(anio, periodo);
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
