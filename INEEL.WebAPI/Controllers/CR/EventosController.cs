using INEEL.DataAccess.CR.Models;
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
    public class EventosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EventosController));
        EventosRepository _eventosRepo;

        public EventosController()
        {
            _eventosRepo = new EventosRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetTiposEventos()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _tiposEventos = await _eventosRepo.getTipoEventos();
                return Ok(_tiposEventos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _eventos = await _eventosRepo.getAll();
                return Ok(_eventos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _evento = await _eventosRepo.getById(Id);
                return Ok(_evento);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Eventos evento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _eventosRepo.create(evento);
                return Ok("Evento creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Eventos evento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _eventosRepo.update(evento);
                return Ok("Evento actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Delete(Eventos evento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _eventosRepo.deleteLogic(evento);
                return Ok("Evento deshabilitado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado([FromBody] Eventos model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _eventosRepo.UpdateEstado(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
