using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.PI;

namespace INEEL.WebAPI.Controllers.PI
{
    public class SolicitudParticiantesDAController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudParticiantesDAController));
        SolicitudParticiantesDARepository _repository;
        public SolicitudParticiantesDAController()
        {
            _repository = new SolicitudParticiantesDARepository();

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByDAColaboracion(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByColaboracion(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
