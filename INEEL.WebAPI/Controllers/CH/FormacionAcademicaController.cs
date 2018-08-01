using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.WebAPI.Utilidades;

namespace INEEL.WebAPI.Controllers.CH
{
    public class FormacionAcademicaController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(FormacionAcademicaController));
        FormacionAcademicaRepository _faRepo;
        AdjuntoRepository _adjuntoRepo;

        public FormacionAcademicaController()
        {
            _adjuntoRepo = new AdjuntoRepository();
            _faRepo = new FormacionAcademicaRepository();
        }
        [Route("api/FormacionAcademica/GetByClaveEmpEstadoFlujo/{clave}/{estados}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpEstadoFlujo(string clave, /*int yearsBack,*/ String estados)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData)); log.Info(new MDCSet(this.ControllerContext.RouteData));
                EstadosToInt param = new EstadosToInt(estados/*, yearsBack*/);
                var sni = await _faRepo.GetByClaveEmpEstadoFlujo(clave, /*param.Fecha,*/ param.ListEstados);
                return Ok(sni);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var fa = await _faRepo.GetAll();
                return Ok(fa);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Route("api/FormacionAcademica/GetByClaveEmpleado/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpleado(string clave)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var fa = await _faRepo.GetByClaveEmpleado(clave);
                return Ok(fa);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var fa = await _faRepo.GetById(Id);
                return Ok(fa);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(FormacionAcademica formacionacademica)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _faRepo.Create(formacionacademica);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetFormacionForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var resultados= await _faRepo.GetFormacionForDetailsBusqueda(parametro);
                return Ok(resultados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(FormacionAcademica formacionacademica)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //Elimar archivo
                
                //solución de ALAN replicada
                //if (formacionacademica.Adjunto != null)
                //    formacionacademica.AdjuntoId = formacionacademica.Adjunto.AdjuntoId;
                await _faRepo.Update(formacionacademica);
                return Ok(formacionacademica);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateSolicitud(FormacionAcademica formacionacademica)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _faRepo.UpdateSolicitud(formacionacademica);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _faRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(FormacionAcademica FormacionAcademica)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _faRepo.UpdateEstado(FormacionAcademica);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAlmaMater(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var formacion = await _faRepo.ObtenerAlmaMater(id);
                return Ok(formacion);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(FormacionAcademica Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _faRepo.ValidarDuplicados(Obj);
                return Ok(exis);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


    }
}
