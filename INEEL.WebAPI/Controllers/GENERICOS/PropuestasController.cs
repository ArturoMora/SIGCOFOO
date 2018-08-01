using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Repositories;
using System.ComponentModel.DataAnnotations;
using INEEL.DataAccess.CR.Models;

namespace INEEL.WebAPI.Controllers.CH
{
    public class PropuestasController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(PropuestasController));
        PropuestaRepository _propuestasRepo;

        public PropuestasController()
        {
            _propuestasRepo = new PropuestaRepository();
        }

        // GET: api/Proyectos
        [HttpPost]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campos = await _propuestasRepo.GetAll();
                return Ok(campos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //[Authorize]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllForModal()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _propuestasRepo.GetAllForModal();
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
        public async Task<IHttpActionResult> GetById(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _propuestasRepo.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Propuestas propuesta)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _propuestasRepo.Create(propuesta);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        /*
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Proyecto proyecto)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _proyectosRepo.Update(proyecto);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }*/

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _propuestasRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetPropuestas([FromBody]Propuestas propuesta)
        {
            String id = null;
            String nombre = null;
            if (propuesta != null)
            {
                id = propuesta.PropuestaId;
                nombre = propuesta.Titulo;
            }
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _propuestasRepo.GetPropuestas(id, nombre);
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
        public async Task<IHttpActionResult> GetPropuestas(String id)
        {
            String likePalabra = id.ToString().ToLower();
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _propuestasRepo.GetPropuestas(likePalabra);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //MARCO MALDONADO
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetPropuestasEmpresa()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _propuestas = await _propuestasRepo.getPropuestasEmpresa();
                return Ok(_propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        [Authorize]
        public async Task<IHttpActionResult> CreatePropuestaEmpresa(Propuestas propuesta)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _propuestasRepo.AsignarPropuesta(propuesta);
                return Ok("Se ha asignado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllPropuestasAsociadas(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _propuestasAsociados = await _propuestasRepo.GetPropuestasAsociados(id);
                return Ok(_propuestasAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPropuestasAsociadosUnidadesEmpresa(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _propuestasAsociados = await _propuestasRepo.GetPropuestasAsociadosUnidadesEmpresa(id);
                return Ok(_propuestasAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetPropuestasAsociadosNodoEmpresa(UnidadOrganizacionalEmpresas id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id.ClaveUnidad));
                var _propuestasAsociados = await _propuestasRepo.GetPropuestasAsociadosUnidadesEmpresa(id.ClaveUnidad);
                return Ok(_propuestasAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAsignado(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _propuestas = await _propuestasRepo.GetAsginado(id);
                return Ok(_propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> GetPropuestaAsignadas(Propuestas id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id.PropuestaId));
                var _propuestas = await _propuestasRepo.GetAsginado(id.PropuestaId);
                return Ok(_propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdatePropuesta(Propuestas propuesta)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _propuestasRepo.Update(propuesta);
                return Ok("Se ha actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Delete(Propuestas propuesta)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _propuestasRepo.Delete(propuesta);
                return Ok("Se ha eliminado el proyecto de la empresa correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}