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
    public class ExperienciaPreviaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ExperienciaPreviaController));
        ExperienciaPreviaRepository _ExPreRepo;
        public ExperienciaPreviaController()
        {
            _ExPreRepo = new ExperienciaPreviaRepository();
        }

        //Obtener todas las experiencias previas
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var ExpPre = await _ExPreRepo.GetAll();
                return Ok(ExpPre);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Obtener experiencias previas por id
        [Route("api/ExperienciaPrevia/GetById/{id}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(string ClaveEmpleado)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var ExpPre = await _ExPreRepo.GetById(ClaveEmpleado);
                return Ok(ExpPre);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear experiencias previas
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(ExperienciaPrevia ExperienciaPrevia)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ExPreRepo.Create(ExperienciaPrevia);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar Experiencia Previa
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(ExperienciaPrevia ExperienciaPrevia)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ExPreRepo.Update(ExperienciaPrevia);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar Experiencia Previa
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(string ClaveEmpleado)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ExPreRepo.Delete(ClaveEmpleado);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
