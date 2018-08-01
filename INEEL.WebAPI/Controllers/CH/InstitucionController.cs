using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class InstitucionController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(InstitucionController));
        //inicializar repertorio
        InstitucionRepository _instiRepo;
        public InstitucionController()
        {
            _instiRepo = new InstitucionRepository();
        }
        //obener institucion
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var instituciones = await _instiRepo.GetAll();
                return Ok(instituciones);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var instituciones = await _instiRepo.GetAllAdmin();
                return Ok(instituciones);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //get one intitucion
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var institucion = await _instiRepo.GetById(id);
                return Ok(institucion);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Add institucion
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create([FromBody]Institucion institucion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _instiRepo.Create(institucion);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Add institucion
        [HttpPost][Authorize] public async Task<IHttpActionResult> CreateFromModal([FromBody]Institucion institucion)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _instiRepo.Create(institucion);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Update institucion
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Institucion insti)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _instiRepo.Update(insti);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Update institucion
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Institucion insti)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _instiRepo.UpdateEstado(insti);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Delete institucion
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _instiRepo.Delete(id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
