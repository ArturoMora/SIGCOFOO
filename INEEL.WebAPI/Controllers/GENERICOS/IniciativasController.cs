using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.CR.Models;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class IniciativasController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(IniciativasController));
        IniciativasRepository _iniciativasRepo;

        public IniciativasController()
        {
            _iniciativasRepo = new IniciativasRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetIniciativasEmpresa()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _iniciativas = await _iniciativasRepo.getIniciativasEmpresa();
                return Ok(_iniciativas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _iniciativasRepo.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        [Authorize] public async Task<IHttpActionResult> CreateIniciativaEmpresa(Iniciativas iniciativa)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _iniciativasRepo.AsignarIniciativa(iniciativa);
                return Ok("Se ha asignado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllIniciativasAsociadas(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _iniciayivasAsociadas = await _iniciativasRepo.GetIniciativasAsociadas(id);
                return Ok(_iniciayivasAsociadas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetIniciativasAsociadasUnidadesEmpresa(string id){
            try{
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _iniciayivasAsociadas = await _iniciativasRepo.GetIniciativasAsociadasUnidadesEmpresa(id);
                return Ok(_iniciayivasAsociadas);
            }
            catch (Exception e) { 
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> GetIniciativasAsociadasNodoEmpresa(UnidadOrganizacionalEmpresas id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id.ClaveUnidad));
                var _iniciayivasAsociadas = await _iniciativasRepo.GetIniciativasAsociadasUnidadesEmpresa(id.ClaveUnidad);
                return Ok(_iniciayivasAsociadas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAsignado(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _iniciativas = await _iniciativasRepo.GetAsignado(id);
                return Ok(_iniciativas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateIniciativa(Iniciativas iniciativa)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _iniciativasRepo.Update(iniciativa);
                return Ok("Se ha actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Delete(Iniciativas iniciativa)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _iniciativasRepo.Delete(iniciativa);
                return Ok("Se ha eliminado la iniciativa de la empresa correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}