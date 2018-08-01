using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.PI.Models;
using log4net;
using INEEL.DataAccess.GEN.Repositories.PI;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.WebAPI.Controllers.PI
{
    public class HistorialPIController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(DerechosAutorController));
        private HistorialPIRepository _piRepo;

        public HistorialPIController()
        {
            _piRepo = new HistorialPIRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByPI(int id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var historial = await _piRepo.GetAllByPI(id);
            if (historial == null)
            {
                return NotFound();
            }
            return Ok(historial);
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var historial = await _piRepo.GetById(id);
            if (historial == null)
            {
                return NotFound();
            }
            return Ok(historial);
        }


        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(HistorialPI historial)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _piRepo.Create(historial);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<IHttpActionResult> Update(HistorialPI historial)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _piRepo.Update(historial);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (DbUpdateConcurrencyException e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return StatusCode(HttpStatusCode.NoContent);
            }


        }


        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int id)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _piRepo.Delete(id);
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
