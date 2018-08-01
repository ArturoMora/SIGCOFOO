using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.WebAPI.Utilidades.Data;
using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class ExposedController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(PersonasController));

        ServiciosExpuestosRepository _repository;

        public ExposedController()
        {
            _repository = new ServiciosExpuestosRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> TotalPublicaciones([FromBody] IndicadorPublicaciones parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var publicaciones = await _repository.GetTotalPublicaiones(parametros);
                return Ok(publicaciones);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> TotalInvestigadores([FromBody] IndicadorInvestigadores parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var publicaciones = await _repository.GetTotalInvestigadores(parametros);
                return Ok(publicaciones);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> TotalInvesSNI([FromBody] IndicadorInvesSNI parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var invesSNI = await _repository.GetTotalInvestigadoresSNI(parametros);
                return Ok(invesSNI);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> TotalDoctores([FromBody] IndicadorDoctoresINEEL parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var doctores = await _repository.GetTotalDoctores(parametros);
                return Ok(doctores);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
