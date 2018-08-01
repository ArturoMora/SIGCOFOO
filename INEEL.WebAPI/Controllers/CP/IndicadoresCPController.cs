using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Repositories.CP;
using INEEL.WebAPI.Utilidades.Data;
using log4net;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.CP
{
    public class IndicadoresCPController : ApiController
    {

        indicadoresCPRepository _irep;

        private static readonly ILog log = LogManager.GetLogger(typeof(IndicadoresCPController));

        public IndicadoresCPController() {
            _irep = new indicadoresCPRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> getEstudiosComunidad(String id)
        {
            try
            {
                string[] parametros = id.Split(',');

                string anio = parametros[0];
                string periodo = parametros[1];

                var obj = await _irep.estudiosComunidad(anio, periodo);
                return Ok(obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> getMapasComunidad(String id)
        {
            try
            {
                string[] parametros = id.Split(',');

                string anio = parametros[0];
                string periodo = parametros[1];

                var obj = await _irep.mapasComunidad(anio, periodo);
                return Ok(obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> getParticipantesComunidad(String id)
        {
            try
            {
                string[] parametros = id.Split(',');

                string anio = parametros[0];
                string periodo = parametros[1];

                var obj = await _irep.participantesComunidad(anio, periodo);
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
