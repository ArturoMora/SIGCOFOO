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
    public class EventoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EventoController));
        EventoRepository  _EventoRepo;

        public EventoController()
        {
            _EventoRepo = new EventoRepository();
        }

        //Obtener todos los evento
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Evento = await _EventoRepo.GetAll();
                return Ok(Evento);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var Evento = await _EventoRepo.GetAllAdmin();
                return Ok(Evento);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //Obtener evento por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetbyId(int id){ try {
                var Evento = await _EventoRepo.GetById(id);
                return Ok(Evento);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear evento
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(Evento Evento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _EventoRepo.Create(Evento);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar evento
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Evento Evento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _EventoRepo.Update(Evento);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar evento
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Evento Evento)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _EventoRepo.UpdateEstado(Evento);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar evento
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _EventoRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
