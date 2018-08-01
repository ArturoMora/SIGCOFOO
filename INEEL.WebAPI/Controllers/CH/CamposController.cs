
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class CamposController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CamposController));
        CamposRepository _camposRepo;

        public CamposController()
        {
            _camposRepo = new CamposRepository();
        }

        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var campos = await _camposRepo.GetAll();
                return Ok(campos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var campos = await _camposRepo.GetAllAdmin();
                return Ok(campos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _camposRepo.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create([FromBody]Campo campo)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _camposRepo.Create(campo);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Campo campo)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _camposRepo.Update(campo);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar estado
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Campo campo)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _camposRepo.UpdateEstado(campo);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _camposRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
