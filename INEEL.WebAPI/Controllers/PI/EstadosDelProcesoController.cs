using INEEL.DataAccess.GEN.Models.PI;
using INEEL.DataAccess.GEN.Repositories.PI;
using INEEL.WebAPI.Utilidades.Data;
using log4net;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.PI
{
    public class EstadosDelProcesoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(DerechosAutorController));
        private EstadoDelProcesoRepository _estadosPinRepo = new EstadoDelProcesoRepository();


        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var ramas = await _estadosPinRepo.GetAll();
                return Ok(ramas);

            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllActivos()
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var tiposPIn = await _estadosPinRepo.GetAllActivos();
                return Ok(tiposPIn);
            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var estado = await _estadosPinRepo.GetById(id);
                if (estado == null)
                {
                    return NotFound();
                }

                return Ok(estado);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        [HttpPut]
        public async Task<IHttpActionResult> Update(EstadoDelProceso estado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _estadosPinRepo.Update(estado);
                return Ok("Registro actualizado exitosamente.");
            }
            catch (ApplicationException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }


        [HttpPost]
        public async Task<IHttpActionResult> Create(EstadoDelProceso estado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _estadosPinRepo.Create(estado);
                return Ok("Registro creado exitosamente.");
            }
            catch (ApplicationException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        [HttpDelete]
        public async Task<IHttpActionResult> DeleteEstadoDelProceso(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _estadosPinRepo.Delete(id);
                return Ok("Registro eliminado exitosamente.");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
