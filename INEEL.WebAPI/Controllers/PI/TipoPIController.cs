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
    public class TipoPIController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TipoPIController));
        TipoPIRepository _repo;

        public TipoPIController()
        {
            _repo = new TipoPIRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var result = await _repo.GetAll();
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
