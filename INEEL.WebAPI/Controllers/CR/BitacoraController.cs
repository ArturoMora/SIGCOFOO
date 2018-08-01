using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Repositories.CR;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CR
{
    public class BitacoraController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BitacoraController));
        BitacoraRepository _bitacoreRepo;

        public BitacoraController()
        {
            _bitacoreRepo = new BitacoraRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _oportunidadHist = await _bitacoreRepo.getOportunidadesById(Id);
                return Ok(_oportunidadHist);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(BitacoraOportunidadNegocio onHist)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _bitacoreRepo.create(onHist);
                return Ok("Evento creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
