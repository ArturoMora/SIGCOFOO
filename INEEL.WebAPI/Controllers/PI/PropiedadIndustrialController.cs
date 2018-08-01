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
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.PI
{
    public class PropiedadIndustrialController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(DerechosAutorController));
        private PropiedadIndustrialRepository _piRepo;

        public PropiedadIndustrialController()
        {
            _piRepo = new PropiedadIndustrialRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllPropiedadInstitutoModal()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _piRepo.GetAllPropiedadInstitutoModal();
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
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _piRepo.GetAll();
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
        public async Task<IHttpActionResult> GetPropiedadIndustrialForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var resultados= await _piRepo.GetPropiedadIndustrialForDetailsBusqueda(parametro);
                return Ok(resultados);
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
                var derechosautor = await _piRepo.GetAllPropiedadInstitutoCount();
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
                var derechosautor = await _piRepo.GetAllPropiedadInstituto();
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
        public async Task<IHttpActionResult> GetByProyecto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _piRepo.GetByProyecto(id);
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
        public async Task<IHttpActionResult> GetAllPropiedadInstitutoReporte(PropiedadIndustrial p)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var derechosautor = await _piRepo.GetAllPropiedadInstitutoReporte(p);
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
            var derechoautor = await _piRepo.GetById(id);
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
            var derechoautor = await _piRepo.GetByClavePersona(id);
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
            var derechoautor = await _piRepo.GetByClaveAutorWithCoAutores(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetPropiedadIndustrialPorPersona(string id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = await _piRepo.GetPropiedadIndustrialPorPersona(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetDatosGrafica()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _piRepo.GetDatosGrafica();
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpPut]
        [Authorize]
        public async Task<IHttpActionResult> Update(PropiedadIndustrial propiedadindustrial)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var respuesta = await _piRepo.Update(propiedadindustrial);
                return Ok(respuesta);
            }
            catch (DbUpdateConcurrencyException e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return StatusCode(HttpStatusCode.NoContent);
            }


        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(PropiedadIndustrial propiedadindustrial)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _piRepo.Create(propiedadindustrial);
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
        public async Task<IHttpActionResult> CreateCH(PropiedadIndustrial propiedadindustrial)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _piRepo.CreateCH(propiedadindustrial);
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
                await _piRepo.Delete(id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> ObtenDatosGrafica()
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var datos = await _piRepo.GetDatosGrafica();
            if (datos == null)
            {
                return NotFound();
            }

            return Ok(datos);
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetByIdYTipoPropiedad(int id)
        {
            log.Info(new MDCSet(this.ControllerContext.RouteData));
            var derechoautor = await _piRepo.GetByIdYTipoPropiedad(id);
            if (derechoautor == null)
            {
                return NotFound();
            }

            return Ok(derechoautor);
        }


    }
}
