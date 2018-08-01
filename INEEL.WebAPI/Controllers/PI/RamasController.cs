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
using INEEL.DataAccess.GEN.Repositories.PI;
using log4net;
using INEEL.WebAPI.Utilidades.Data;


namespace INEEL.WebAPI.Controllers.PI
{
    public class RamasController : ApiController
    {

        private static readonly ILog log = LogManager.GetLogger(typeof(DerechosAutorController));
        private RamaRepository _ramaRepo = new RamaRepository();

        // GET: api/GetAll
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var ramas = await _ramaRepo.GetAll();
                return Ok(ramas);

            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        // GET: api/GetAllActivas
        [HttpGet]
        public async Task<IHttpActionResult> GetAllActivas()
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var ramas = await _ramaRepo.GetAllActivas();
                return Ok(ramas);

            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        // GET: api/Ramas/5
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var rama = await _ramaRepo.GetById(id);
                if (rama == null)
                {
                    return NotFound();
                }

                return Ok(rama);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }


        [HttpPut]
        public async Task<IHttpActionResult> Update(Rama rama)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ramaRepo.Update(rama);
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
        public async Task<IHttpActionResult> Create(Rama rama)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ramaRepo.Create(rama);
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

        // DELETE: api/Ramas/5
        [ResponseType(typeof(Rama))]
        public async Task<IHttpActionResult> DeleteRama(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ramaRepo.Delete(id);
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