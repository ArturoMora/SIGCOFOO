using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    
    public class JerarquiaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(JerarquiaController));

        JerarquiaRepository _repository;

        public JerarquiaController() {
            _repository = new JerarquiaRepository();
        }
        
       [HttpPost]
        public async Task<IHttpActionResult> isJefeHiperonimoDeProyecto(Jerarquia model)
        {
            try { /*log.Info(new MDCSet(this.ControllerContext.RouteData));*/
                var Jerarquia = await _repository.isJefeHiperonimoDeProyecto(model);
                return Ok(Jerarquia);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> isJefeHiperonimo(Jerarquia model)
        {
            try { /*log.Info(new MDCSet(this.ControllerContext.RouteData));*/
                var Jerarquia = await _repository.isJefeHiperonimo(model);
                return Ok(Jerarquia);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia model)
        {
            try { /*log.Info(new MDCSet(this.ControllerContext.RouteData));*/
                var Jerarquia = await _repository.isJefeHiperonimoByUnidadOrganizacionalId(model);
                return Ok(Jerarquia);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}