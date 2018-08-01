using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.PI;

namespace INEEL.WebAPI.Controllers.PI
{
    public class AutoresIntPIPatrimonioController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutoresIntPIPatrimonioController));
        PersonasRepository _PersonasRepository;
        AutoresIntPIPatrimonioRepository _repository;
        public AutoresIntPIPatrimonioController()
        {
            _repository = new AutoresIntPIPatrimonioRepository();
            _PersonasRepository = new PersonasRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByColaboracionRequisicion(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByColaboracion(id);
                foreach (var soli in result)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombreCompleto = p.NombreCompleto;
                }
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
