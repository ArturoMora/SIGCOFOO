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
    public class RevistaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(RevistaController));
        RevistaRepository _RevistaRepo;

        public RevistaController()
        {
            _RevistaRepo = new RevistaRepository();
        }

        //Obtener todas las revistas
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Revista = await _RevistaRepo.GetAll();
                return Ok(Revista);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var Revista = await _RevistaRepo.GetAllAdmin();
                return Ok(Revista);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }



        //Obtener revista por id
        [Route("api/Revista/GetByNombre/{id}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByNombre(string id)
        {
            try
            {
                var Revista = await _RevistaRepo.GetByNombre(id);
                return Ok(Revista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }



        //Obtener revista por id
        [Route("api/Revista/GetById/{id}")]
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var Revista = await _RevistaRepo.GetById(id);
                return Ok(Revista);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear revista
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(Revista Revista)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _RevistaRepo.Create(Revista);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar Revista
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Revista Revista)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _RevistaRepo.Update(Revista);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Revista
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Revista Revista)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _RevistaRepo.UpdateEstado(Revista);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar revista
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _RevistaRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
