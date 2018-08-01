using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class PropuestasFFController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(PropuestasFFController));
        private PropuestasFFRepository _entityRepo;
       
        public PropuestasFFController()
        {
            _entityRepo = new PropuestasFFRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetPropuestasByFF(ParametrosFF parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reporteProyectosFF = await _entityRepo.GetPropuestasByFF(parametros);
                return Ok(reporteProyectosFF);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


    }
}
