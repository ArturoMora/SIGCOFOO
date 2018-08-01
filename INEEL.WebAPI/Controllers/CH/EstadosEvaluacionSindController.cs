using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class EstadosEvaluacionSindController : ApiController
    {      
        private static readonly ILog log = LogManager.GetLogger(typeof(EstadosEvaluacionSindController));

        EstadosEvaluacionSindRepository _repository;

        public EstadosEvaluacionSindController()
        {
            _repository = new EstadosEvaluacionSindRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var campo = await _repository.GetAll();
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.Get(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(EstadoEvaluacionSind datos)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(datos);
                return Ok("Nivel de competencia asignado correctamente a la categoría");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(EstadoEvaluacionSind datos)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(datos);
                return Ok("Nivel de competencia actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repository.Delete(Id);
                return Ok("Nivel de competencia eliminado correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}