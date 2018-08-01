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
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.PI
{
    public class DerechosAutorController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(DerechosAutorController));
        private DerechosAutorRepository _daRepo;

        // GET: api/DerechosAutor
        public DerechosAutorController()
        {
            _daRepo = new DerechosAutorRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetAll();
                if (derechosautor == null)
                {
                    return NotFound();
                }
                return Ok(derechosautor);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllInstitutoCount()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetAllPropiedadInstitutoCount();
                return Ok(derechosautor);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetDerechosAutorForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetDerechosAutorForDetailsBusqueda(parametro);
                return Ok(derechosautor);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetByProyecto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetByProyecto(id);
                return Ok(derechosautor);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllPropiedadInstitutoModal()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetAllPropiedadInstitutoModal();
                if (derechosautor == null)
                {
                    return NotFound();
                }
                return Ok(derechosautor);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllInstituto()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetAllPropiedadInstituto();
                if (derechosautor == null)
                {
                    return NotFound();
                }
                return Ok(derechosautor);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetAllPropiedadInstitutoReporte(DerechosAutor p)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _daRepo.GetAllPropiedadInstitutoReporte(p);
                if (derechosautor == null)
                {
                    return NotFound();
                }
                return Ok(derechosautor);
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
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = await _daRepo.GetById(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClavePersona(string id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = await _daRepo.GetByClavePersona(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveAutorWithCoAutores(string id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = await _daRepo.GetByClaveAutorWithCoAutores(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }


        //ESTE METODO SE AGREGO PARA LAS CONSULTAS QUE SE HACEN EN FICHA PERSONAL 
        [HttpGet]
        public async Task<IHttpActionResult> GetPorClavePersona(string id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = await _daRepo.GetPorClavePersona(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }

        [HttpPut]
        [Authorize]
        public async Task<IHttpActionResult> Update(DerechosAutor derechosAutor)
        {
            
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _daRepo.Update(derechosAutor);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (DbUpdateConcurrencyException e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return StatusCode(HttpStatusCode.NoContent);
            }


        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(DerechosAutor derechosAutor)
        {
           
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _daRepo.Create(derechosAutor);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateCH(DerechosAutor derechosAutor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _daRepo.CreateCH(derechosAutor);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        // DELETE: api/DerechosAutor/5
        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int id)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _daRepo.Delete(id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



        [HttpGet]
        public IHttpActionResult GetDerechosAutorAnio()
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = _daRepo.GetDerechosAutorPorAnio();
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }


    }
}