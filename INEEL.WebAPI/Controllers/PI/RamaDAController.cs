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
    public class RamaDAController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(RamaDAController));
        RamaDARepository _ramaRepo;

        public RamaDAController()
        {
            _ramaRepo = new RamaDARepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var result = await _ramaRepo.GetAll();
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
