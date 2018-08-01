using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ProyectosFFController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ProyectosFFController));
        private ProyectosFFRepository _entityRepo;
       
        public ProyectosFFController()
        {
            _entityRepo = new ProyectosFFRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetProyectosByFF(ParametrosFF parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reporteProyectosFF = await _entityRepo.GetProyectosByFF(parametros);
                return Ok(reporteProyectosFF);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


    }
}
