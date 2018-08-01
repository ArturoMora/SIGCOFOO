using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class TipoPersonalController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TipoPersonalController));

        TipoPersonalRepository _repository;

        public TipoPersonalController()
        {
            _repository = new TipoPersonalRepository();
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
        public async Task<IHttpActionResult> GetById(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(TipoPersonal obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Tipo de puesto creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(TipoPersonal obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Tipo de puesto actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repository.Delete(Id);
                return Ok("Tipo de puesto eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(TipoPersonal obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}