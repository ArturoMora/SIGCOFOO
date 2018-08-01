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
    public class NivelCursoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(NivelCursoController));
        NivelCursoRepository _NiCuRepo;
        public NivelCursoController()
        {
            _NiCuRepo = new NivelCursoRepository();
        }

        //Obtener todos niveles de curso
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var NivelCurso = await _NiCuRepo.GetAll();
                return Ok(NivelCurso);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var NivelCurso = await _NiCuRepo.GetAllAdmin();
                return Ok(NivelCurso);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Obtener nivel curso por id
        [Route("api/NivelCurso/GetById/{id}")]
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var NivelCurso = await _NiCuRepo.GetById(id);
                return Ok(NivelCurso);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear nivel curso
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(NivelCurso NivelCurso)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _NiCuRepo.Create(NivelCurso);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar nivel curso
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(NivelCurso NivelCurso)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _NiCuRepo.Update(NivelCurso);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar nivel curso
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(NivelCurso NivelCurso)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _NiCuRepo.UpdateEstado(NivelCurso);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar nivel curso
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _NiCuRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
