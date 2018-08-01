using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class EstadoPonenciaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EstadoPonenciaController));
        EstadoPonenciaRepository _EPRepo;

        public EstadoPonenciaController()
        {
            _EPRepo = new EstadoPonenciaRepository();
        }

        //Obtener todos los estados de publicacion
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var EP = await _EPRepo.GetAll();
                return Ok(EP);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
