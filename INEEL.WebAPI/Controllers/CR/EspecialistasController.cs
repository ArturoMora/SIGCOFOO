using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Repositories.CR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CR
{
    public class EspecialistasController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EspecialistasController));
        EspecialistaRepository _especialistaRepo;

        public EspecialistasController()
        {
            _especialistaRepo = new EspecialistaRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _especialistas = await _especialistaRepo.getAll();
                return Ok(_especialistas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _especialista = await _especialistaRepo.getById(Id);
                return Ok(_especialista);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Especialista especialista)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _especialistaRepo.create(especialista);
                return Ok("Especialista creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Especialista especialista)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _especialistaRepo.update(especialista);
                return Ok("Especialista actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Delete(Especialista especialista)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _especialistaRepo.deleteLogic(especialista);
                return Ok("Especialista deshabilitado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
