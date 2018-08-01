using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Repositories.CP;
using INEEL.WebAPI.Utilidades.Data;
using log4net;

namespace INEEL.WebAPI.Controllers.CP
{
    public class EstadoArteController : ApiController
    {
        private EstadoArteRepository _entityRepo;
        private static readonly ILog log = LogManager.GetLogger(typeof(EstadoArteController));
        public EstadoArteController()
        {
            _entityRepo = new EstadoArteRepository();
     
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAll();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetById(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> CountEstadoArte()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.CountEstadoArte();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllConsulta()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAllConsulta();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetAllConsultaPorOC(EstadoArte parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAllConsultaPorOC(parametros);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByComunidad(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entities = await _entityRepo.GetByComunidad(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]EstadoArte model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]EstadoArte model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpDelete]
        public async Task<IHttpActionResult> DeleteOCWithAutores(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.DeleteOCWithAutores(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
