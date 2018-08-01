using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Repositories.CR;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CR
{
    public class SeguimientoOportunidadController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SeguimientoOportunidadController));
        SeguimientoOportunidadRepository _seguimientoRepo;

        public SeguimientoOportunidadController()
        {
            _seguimientoRepo = new SeguimientoOportunidadRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _seguimientosONS = await _seguimientoRepo.getAll(Id);
                return Ok(_seguimientosONS);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _seguimientoON = await _seguimientoRepo.getById(Id);
                return Ok(_seguimientoON);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(SeguimientoOportunidad seguimientoON)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _seguimientoRepo.create(seguimientoON);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(SeguimientoOportunidad seguimientoON)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _seguimientoRepo.update(seguimientoON);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _seguimientoRepo.delete(Id);
                return Ok("resgistro eliminada correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}