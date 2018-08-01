using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;

namespace INEEL.WebAPI.Controllers.GI
{
    [Authorize]
    public class PropuestaController : ApiController
    {

        private PropuestaRepository _repo;

        public PropuestaController()
        {
            _repo = new PropuestaRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> CountPropuesta()
        {
            try
            {
                var entities = await _repo.CountPropuesta();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllForModal()
        {
            try
            {
                var entities = await _repo.GetAllForModal();
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

        [HttpGet]
        public async Task<IHttpActionResult> GetAllCarterabyEmpleado(String id)
        {
            try
            {
                var entities = await _repo.GetAllCarterabyEmpleado(id);
                return Ok(entities);
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
                var entities = await _repo.GetAllCartera();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetJustificacionSolicitudRechazada(string id)
        {
            try
            {
                var entities = await _repo.GetJustificacionSolicitudRechazada(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetJustificacionSolicitudAceptada(string id)
        {
            try
            {
                var entities = await _repo.GetJustificacionSolicitudAceptada(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetJustificacionSolicitudAModificar(string id)
        {
            try
            {
                var entities = await _repo.GetJustificacionSolicitudAModificar(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        //[HttpGet]
        //public async Task<IHttpActionResult> GetJustificacionPlanAceptado(string id)
        //{
        //    try
        //    {
        //        var entities = await _repo.GetJustificacionPlanAceptado(id);
        //        return Ok(entities);
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}


        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaCartera(Propuesta p)
        {
            try
            {
                var entities = await _repo.GetConsultaCartera(p);
                return Ok(entities);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetSegmentosMercado()
        {
            try
            {
                var entities = await _repo.GetSegmentosMercado();
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
        public async Task<IHttpActionResult> GetById(String Id)
        {
            try
            {
                var entity = await _repo.GetById(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByIdIdentity(int Id)
        {
            try
            {
                var entity = await _repo.GetByIdIdentity(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create(Propuesta model)
        {
            model.Vigente = true;
            model.Prioridad = 0;

            try
            {
                var id = await _repo.Create(model);
                return Ok(id);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPut]
        public async Task<IHttpActionResult> Update(Propuesta model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _repo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Propuesta model)
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
        public async Task<IHttpActionResult> Delete(String Id)
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

        [HttpDelete]
        public async Task<IHttpActionResult> DeletePropuestaConPlan(int Id)
        {
            try
            {
                await _repo.DeletePropuestaConPlan(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}
