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
    public class GradoAcademicoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(GradoAcademicoController));

        GradoAcademicoRepository _gaRepo;

        public GradoAcademicoController()
        {
            _gaRepo = new GradoAcademicoRepository();
        }
        

       [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var campos = await _gaRepo.GetAll();
                return Ok(campos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllTesis()
        {
            try
            {
                var campos = await _gaRepo.GetAllTesis();
                return Ok(campos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var campos = await _gaRepo.GetAllAdmin();
                return Ok(campos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _gaRepo.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(GradoAcademico gradoacademico)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _gaRepo.Create(gradoacademico);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(GradoAcademico gradoacademico)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _gaRepo.Update(gradoacademico);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(GradoAcademico gradoacademico)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _gaRepo.UpdateEstado(gradoacademico);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _gaRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
