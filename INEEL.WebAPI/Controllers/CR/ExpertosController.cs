using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Repositories.CR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ExpertosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ExpertosController));
        ExpertosRepository _expertoRepo;

        public ExpertosController()
        {
            _expertoRepo = new ExpertosRepository();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countByStatus(Boolean id)
        {
            try {
                var cant = await _expertoRepo.countByStatus(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> Getall()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var expertos = await _expertoRepo.GetAll();
                return Ok(expertos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByComunidad(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var expertos = await _expertoRepo.GetByComunidad(id);
                return Ok(expertos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var experto = await _expertoRepo.GetById(id) ;
                return Ok(experto);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByContactoId(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var experto = await _expertoRepo.GetByContactoId(id);
                return Ok(experto);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPaisesRelacionExpertos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var experto = await _expertoRepo.GetPaisesRelacionExpertos();
                return Ok(experto);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetEmpresasRelacionExpertos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var experto = await _expertoRepo.GetEmpresasRelacionExpertos();
                return Ok(experto);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetComunidadesRelacionExpertos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var experto = await _expertoRepo.GetComunidadesRelacionExpertos();
                return Ok(experto);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetLineasRelacionExpertos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var experto = await _expertoRepo.GetLineasRelacionExpertos();
                return Ok(experto);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Experto experto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _expertoRepo.Create(experto);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaParametrizadaExpertos(Experto experto)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _expertoRepo.GetConsultaParametrizadaExpertos(experto);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> createSinInvestigadores(Experto experto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result =   await _expertoRepo.CreateSinInvestigadores(experto);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Experto experto)
        {
            

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _expertoRepo.Update(experto);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateComunidad(Experto experto)
        {


            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _expertoRepo.UpdateComunidadExperto(experto);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _expertoRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
