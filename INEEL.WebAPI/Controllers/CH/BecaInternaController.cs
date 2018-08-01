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
    public class BecaInternaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BecaInternaController));
        BecaInternaRepository _BecaInternaRepo;

        public BecaInternaController()
        {
            _BecaInternaRepo = new BecaInternaRepository();
        }

        //Obtener todas las becas
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var becasInternas = await _BecaInternaRepo.GetAll();
                return Ok(becasInternas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var becasInternas = await _BecaInternaRepo.GetAllAdmin();
                return Ok(becasInternas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //Obtener beca interna por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetbyId(int id){ try {
                var BecaInterna = await _BecaInternaRepo.GetById(id);
                return Ok(BecaInterna);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear beca interna
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(BecaInterna BecaInterna)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _BecaInternaRepo.Create(BecaInterna);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar beca interna
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(BecaInterna BecaInterna)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _BecaInternaRepo.Update(BecaInterna);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar beca interna
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(BecaInterna BecaInterna)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _BecaInternaRepo.UpdateEstado(BecaInterna);
                return Ok();
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar beca interna
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _BecaInternaRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
