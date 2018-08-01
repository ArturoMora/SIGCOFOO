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
    public class NivelPublicacionController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(NivelPublicacionController));
        NivelPublicacionRepository _NiPubRepo;

        public NivelPublicacionController()
        {
            _NiPubRepo = new NivelPublicacionRepository();
        }

        //Obtener todos los niveles de publicacion
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var NivelPublicacion = await _NiPubRepo.GetAll();
                return Ok(NivelPublicacion);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var NivelPublicacion = await _NiPubRepo.GetAllAdmin();
                return Ok(NivelPublicacion);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Obtener nivel publicacion por id
        [Route("api/NivelPublicacion/GetById/{id}")]
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var NivelPublicacion = await _NiPubRepo.GetById(id);
                return Ok(NivelPublicacion);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear nivel publicacion
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(NivelPublicacion NivelPublicacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _NiPubRepo.Create(NivelPublicacion);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar nivel publicacion
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(NivelPublicacion NivelPublicacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _NiPubRepo.Update(NivelPublicacion);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar nivel publicacion
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(NivelPublicacion NivelPublicacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _NiPubRepo.UpdateEstado(NivelPublicacion);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar nivel publicacion
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _NiPubRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
