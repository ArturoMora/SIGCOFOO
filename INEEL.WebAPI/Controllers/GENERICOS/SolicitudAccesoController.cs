using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using System.Collections.Generic;
using INEEL.DataAccess.GEN.Models.MT.ITF;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class SolicitudAccesoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudAccesoController));
        private SolicitudAccesoRepository _entityRepo;

        public SolicitudAccesoController()
        {
            _entityRepo = new SolicitudAccesoRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var entities = await _entityRepo.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetSolicitudByItf(BitacoraITFSolicitudDescarga model)
        {
            try
            {
                var entities = await _entityRepo.GetSolicitudByItf(model);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Route("api/SolicitudAcceso/ExisteSolicitud/{ClavePersonaSolicitante}/{InformacionOCId}/{EstadoFlujoId}")]
        [HttpGet]
        public async Task<IHttpActionResult> ExisteSolicitud(String ClavePersonaSolicitante, string InformacionOCId, int EstadoFlujoId)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var existe = await _entityRepo.ExisteSolicitud(ClavePersonaSolicitante, InformacionOCId, EstadoFlujoId);
                return Ok(existe);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [Route("api/SolicitudAcceso/SolicitudDeAcceso/{ClavePersonaSolicitante}/{InformacionOCId}/{EstadoFlujoId}")]
        [HttpGet]
        public async Task<IHttpActionResult> SolicitudDeAcceso(String ClavePersonaSolicitante, string InformacionOCId, int EstadoFlujoId)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var solicitud = await _entityRepo.solicitud(ClavePersonaSolicitante, InformacionOCId, EstadoFlujoId);
                return Ok(solicitud);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Route("api/SolicitudAcceso/GetAllByUnidadWithEstadoFlujoTop/{unidadId}/{estadoFlujoId}/{top}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByUnidadWithEstadoFlujoTop(String unidadId, int estadoFlujoId, int top)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAllByUnidadWithEstadoFlujoTop(unidadId, estadoFlujoId, top);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [Route("api/SolicitudAcceso/GetAllByUnidadWithEstadoFlujo/{unidadId}/{estadoFlujoId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByUnidadWithEstadoFlujo(String unidadId, string estadoFlujoId)// se agrega Route para mandar dos parametros
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var ids = estadoFlujoId.Split(',');
                List<String> listaIds = new List<string>(ids);
                var entities = await _entityRepo.GetAllByUnidadWithEstadoFlujoList(unidadId, listaIds);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(long Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Route("api/SolicitudAcceso/existeSolicitudByPersonaInformOCIdANDestadoFlujo/{personaId}/{InformacionOCId}/{estadoFlujoId}")]
        [HttpGet]
        public async Task<IHttpActionResult> existeSolicitudByPersonaInformOCIdANDestadoFlujo(String personaId, string InformacionOCId, int estadoFlujoId)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _entityRepo.existeSolicitudByPersonaInformOCIdANDestadoFlujo(personaId, InformacionOCId, estadoFlujoId);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create([FromBody]SolicitudAcceso model)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(model.ModuloId))
                {
                    throw new Exception("no se indicó el módulo");
                }
                //var entity = await _entityRepo.existeSolicitudByPersonaInformOCIdANDestadoFlujo(personaId, InformacionOCId, estadoFlujoId);
                var rechazoPrevio = await _entityRepo.SolicitudByPersonaInformOCIdANDestadoFlujo(model.ClavePersonaSolicitante, model.InformacionOCId, 9); //9 is rechazado
                if (rechazoPrevio != null)
                {
                    await _entityRepo.UpdateEstado(rechazoPrevio.SolicitudAccesoId, 8); //se actualiza a 8: nueva solicitud de acceso
                    rechazoPrevio.EstadoFlujoId = 8;
                    return Ok(rechazoPrevio);
                }
                else
                {
                    await _entityRepo.Create(model); //necesario recuperar el objeto para obtener el nuevo id en el front
                    return Ok(model);
                }


            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> AutorizaResponsableUnidadGEN(long id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var model = await _entityRepo.Get(id);
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    model.EstadoFlujoId = 10;
                    await _entityRepo.Update(model);
                }
                catch (Exception)
                {

                }
                return Ok("Solicitud aceptada!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> RechazaResponsableUnidadGEN(long id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var model = await _entityRepo.Get(id);
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    model.EstadoFlujoId = 9; //9  Denegado
                    await _entityRepo.Update(model);
                }
                catch (Exception)
                {

                }
                return Ok("Solicitud aceptada!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]SolicitudAcceso model)
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

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(long Id)
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
