using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Repositories.CP;
using INEEL.WebAPI.Utilidades.Data;
using log4net;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.CP
{
    public class DocumentoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(DocumentoController));
        private DocumentoRepository _entityRepo;

        AdjuntoRepository _adjuntoRepo;

        public DocumentoController()
        {
            _entityRepo = new DocumentoRepository();
            _adjuntoRepo = new AdjuntoRepository();


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

        [HttpGet]
        public async Task<IHttpActionResult> GetByComunidad2(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entities = await _entityRepo.GetByComunidad2(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByInvitadoComunidad(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entities = await _entityRepo.GetByInvitadoComunidad(id);
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

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]Documento model)
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
        public async Task<IHttpActionResult> Update(Documento model)
        {
          

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

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteDoc(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _adjuntoRepo.Delete(Id);
                return Ok("Archivo eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> delete(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
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
