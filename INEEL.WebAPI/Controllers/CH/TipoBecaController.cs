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
    public class TipoBecaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TipoBecaController));
        TipoBecaRepository _TipoBecaRepo;
        public TipoBecaController()
        {
            _TipoBecaRepo = new TipoBecaRepository();
        }

        //Obtener todos los tipos de beca
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var TipoBeca = await _TipoBecaRepo.GetAll();
                return Ok(TipoBeca);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var TipoBeca = await _TipoBecaRepo.GetAllAdmin();
                return Ok(TipoBeca);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Obtener tipo beca por id
        [Route("api/TipoBeca/GetById/{id}")]
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var TipoBeca = await _TipoBecaRepo.GetById(id);
                return Ok(TipoBeca);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear TipoBeca
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(TipoBeca TipoBeca)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _TipoBecaRepo.Create(TipoBeca);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar TipoBeca
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(TipoBeca TipoBeca)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _TipoBecaRepo.Update(TipoBeca);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Estado
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(TipoBeca TipoBeca)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _TipoBecaRepo.UpdateEstado(TipoBeca);
                return Ok();
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //Eliminar TipoBeca
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _TipoBecaRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
