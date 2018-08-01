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
    public class EstadoPublicacionController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EstadoPublicacionController));
        EstadoPublicacionRepository _EPRepo;

        public EstadoPublicacionController()
        {
            _EPRepo = new EstadoPublicacionRepository();
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
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var EP = await _EPRepo.GetAllAdmin();
                return Ok(EP);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //Obtener estado de publicacion por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetbyId(int id){ try {
                var EP = await _EPRepo.GetById(id);
                return Ok(EP);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear estado de publicacion
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(EstadoPublicacion EstadoPublicacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _EPRepo.Create(EstadoPublicacion);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar estado publicacion
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(EstadoPublicacion EstadoPublicacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _EPRepo.Update(EstadoPublicacion);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar estado publicacion
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(EstadoPublicacion EstadoPublicacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _EPRepo.UpdateEstado(EstadoPublicacion);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar estado publicacion
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _EPRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
