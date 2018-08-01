using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Controllers.GI
{
    public class PlanNegocioEvolutivoController : ApiController
    {

        private PlanNegocioEvolutivoRepository _repo;

        public PlanNegocioEvolutivoController()
        {
            _repo = new PlanNegocioEvolutivoRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> CountPlanNegocioEvolutivo()
        {
            try
            {
                var entities = await _repo.CountPlanNegocioEvolutivo();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var entities = await _repo.GetAll();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> EvidenciaDownload(int id, String clave)
        {
            //id id del registro de propuestas
            //clave, clave de la persona
            try
            {
                var entity = await _repo.EvidenciaDownload(id, clave);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllCartera()
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetAllCartera();
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaCartera(PlanNegocioEvolutivo p)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetConsultaCartera(p);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllCartera2()
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetAllCartera2();
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetMisPlanesAnualesConsulta(PlanNegocioEvolutivo p)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetMisPlanesAnualesConsulta(p);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado(String id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetAllByEmpleado(id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado2(String id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetAllByEmpleado2(id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetById(Id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetComentariosSolicitudIndividualPlan(string Id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetComentariosSolicitudIndividualPlan(Id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetJustificacionPlanAceptado(string id)
        {
            try
            {
                var entities = await _repo.GetJustificacionPlanAceptado(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetSolicitud(string Id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetSolicitud(Id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> getbyidPropuesta(int Id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.getbyidPropuesta(Id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdCollections(int Id)
        {
            try
            {
                var PlanNegocioEvolutivo = await _repo.GetByIdCollections(Id);
                return Ok(PlanNegocioEvolutivo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]PlanNegocioEvolutivo model)
        {
            //id 
            //clave = clave de la persona logeada
            var fecha = DateTime.Now;
            model.FechaRegistro = fecha;
            model.FechaModificacion = fecha;
            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                else
                {
                    await _repo.Create(model, clavePersona, nombrePersona);
                    return Ok("Registro creado exitosamente!");
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> UpdateTipoAcceso([FromBody]PlanNegocioEvolutivo model)
        {
            var fecha = DateTime.Now;
            model.FechaModificacion = fecha;

            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                else
                {
                    await _repo.UpdateTipoAcceso(model, clavePersona, nombrePersona);
                    return Ok("Acceso actualizado exitosamente!");
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]PlanNegocioEvolutivo model)
        {
            var fecha = DateTime.Now;
            model.FechaModificacion = fecha;

            try
            {
                var clavePersona = SimpleSessionPersister.PersonaId;
                var nombrePersona = SimpleSessionPersister.nombreUsuario;
                if (String.IsNullOrEmpty(clavePersona) || String.IsNullOrEmpty(nombrePersona))
                {
                    throw new Exception("No se identifica al usuario");
                }
                else
                {
                    await _repo.Update(model, clavePersona, nombrePersona);
                    return Ok("Registro actualizado exitosamente!");
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(PlanNegocioEvolutivo model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _repo.UpdateEstado(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                await _repo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}
