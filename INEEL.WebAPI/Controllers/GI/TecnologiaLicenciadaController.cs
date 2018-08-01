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
    public class TecnologiaLicenciadaController : ApiController
    {

        private TecnologiaLicenciadaRepository _repo;

        public TecnologiaLicenciadaController()
        {
            _repo = new TecnologiaLicenciadaRepository();
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> CountSTL()
        {
            try
            {
                var entities = await _repo.CountSTL();
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

        [HttpPost]
        public async Task<IHttpActionResult> GetAllConsultaParametrizadaTecnologia(TecnologiaLicenciada p)
        {
            try
            {
                var entities = await _repo.GetAllConsultaParametrizadaTecnologia(p);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ListaTipoPropiedadIndustrial()
        {
            try
            {
                var entities = await _repo.ListaTipoPropiedadIndustrial();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ListaEstadoLicenciamiento()
        {
            try
            {
                var entities = await _repo.ListaEstadoLicenciamiento();
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
        /// <summary>
        /// Retorna los registros donde el empleado es jefe de proyecto de los prooyectos asociados a los registros
        /// o es gerente  dada la unidad organizacional de los proyectos
        /// </summary>
        /// <param name="id">claveEmpleado</param>
        /// <param name="clave">unidadOrganizacionalId</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado(String id, String clave)
        {//clave es unidadOrganizacionalId
            try
            {
                var empleado = id;
                var unidadOrganizacionalId = clave;
                var entities = await _repo.GetAllByEmpleado(empleado, unidadOrganizacionalId);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaByEmpleado(TecnologiaLicenciada p)
        {
            try
            {
                var entities = await _repo.GetConsultaByEmpleado(p);
                return Ok(entities);
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
                var TecnologiaLicenciada = await _repo.GetById(Id);
                return Ok(TecnologiaLicenciada);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]TecnologiaLicenciada model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
                    //await _repo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateProyecto([FromBody]TecnologiaLicenciada model)
        {
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
                    await _repo.UpdateProyecto(model, clavePersona, nombrePersona);
                    // await _repo.UpdateProyecto(model);
                    return Ok("Registro actualizado exitosamente!");
                }
            }           
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]TecnologiaLicenciada model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
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
