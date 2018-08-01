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
    public class TiposEventosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TiposEventosController));
        TipoEventosRepository _tipoEventosRepo;

        public TiposEventosController()
        {
            _tipoEventosRepo = new TipoEventosRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _tipoEventos = await _tipoEventosRepo.getAll();
                return Ok(_tipoEventos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _tipoEvento = await _tipoEventosRepo.getById(Id);
                return Ok(_tipoEvento);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(TipoEventoON tipoEvento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _tipoEventosRepo.create(tipoEvento);
                return Ok("Evento creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(TipoEventoON tipoEvento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _tipoEventosRepo.update(tipoEvento);
                return Ok("Evento actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Delete(TipoEventoON tipoEvento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _tipoEventosRepo.deleteLogic(tipoEvento);
                return Ok("Tipo de Evento deshabilitado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
