using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.CH;
using System.Collections.Generic;

namespace INEEL.WebAPI.Controllers.CH
{
    [Authorize]
    public class DetalleEvaluacionConductualController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(DetalleEvaluacionConductualController));

        DetalleEvaluacionConductualesRepository _repository;
        public DetalleEvaluacionConductualController()
        {
            _repository = new DetalleEvaluacionConductualesRepository();
        }

        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var campo = await _repository.GetAll();
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEvaluacionResultado(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var campo = await _repository.GetByClaveEvaluacionResultado( id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEvaluacion(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var campo = await _repository.GetByClaveEvaluacion(id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetByMatrizEvaluacion(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByMatrizEvaluacion(parametros);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.Get(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(DetalleEvaluacionCompetenciasConductuales obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Los datos de la evaluación fueron registrados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(DetalleEvaluacionCompetenciasConductuales obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Los datos de la evaluacíon fueron actualizados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repository.Delete(Id);
                return Ok("Los datos de la evaluación fueron eliminados correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
