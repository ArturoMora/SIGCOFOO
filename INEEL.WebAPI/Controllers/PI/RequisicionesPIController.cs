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
    public class RequisicionesPIController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(RequisicionesPIController));
        RequisicionesPIRepository _repository;
        public RequisicionesPIController()
        {
            _repository = new RequisicionesPIRepository();

        }
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var result = await _repository.GetById(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
