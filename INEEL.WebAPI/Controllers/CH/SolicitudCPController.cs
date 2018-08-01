using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class SolicitudCPController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudCPController));
        SolicitudCPRepository _SolicitudRepository;
        PersonasRepository _PersonasRepository;

        public SolicitudCPController()
        {
            _SolicitudRepository = new SolicitudCPRepository();
            _PersonasRepository = new PersonasRepository();
        }

        //Obtener todos los registros
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Solicitud = await _SolicitudRepository.GetAll();

                foreach (var soli in Solicitud)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombreCompleto = p.NombreCompleto;
                }
                return Ok(Solicitud);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Update Country
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(SolicitudCP Solicitud)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _SolicitudRepository.UpdateEstado(Solicitud);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(SolicitudCP Solicitud)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _SolicitudRepository.Create(Solicitud);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> UpdateCreate(SolicitudCP Solicitud)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _SolicitudRepository.UpdateCreate(Solicitud);
                return Ok("Registrado correctamente, " + result.SolicitudId);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
