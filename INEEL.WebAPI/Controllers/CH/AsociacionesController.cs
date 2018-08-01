using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AsociacionesController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AsociacionesController));
        AsociacionesRepository _asociacionesRepo;
        AdjuntoRepository _adjuntoRepo;
        public AsociacionesController()
        {
            _asociacionesRepo = new AsociacionesRepository();
            _adjuntoRepo = new AdjuntoRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var campos = await _asociacionesRepo.GetAll();
                return Ok(campos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpleado(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var campo = await _asociacionesRepo.GetByClaveEmpleado(id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var asociacion = await _asociacionesRepo.GetById(id);
                return Ok(asociacion);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Asociaciones asociacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _asociacionesRepo.Create(asociacion);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Asociaciones asociacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));

                //solución de ALAN replicada
                //if (asociacion.Adjunto != null)
                //    asociacion.AdjuntoId = asociacion.Adjunto.AdjuntoId;

                await _asociacionesRepo.Update(asociacion);
                return Ok(asociacion);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Asociaciones Asociaciones)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _asociacionesRepo.UpdateEstado(Asociaciones);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateSolicitud(Asociaciones Asociaciones)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _asociacionesRepo.UpdateSolicitud(Asociaciones);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _asociacionesRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
