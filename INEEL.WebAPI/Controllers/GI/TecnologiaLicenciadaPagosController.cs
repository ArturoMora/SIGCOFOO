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
    public class TecnologiaLicenciadaPagosController : ApiController
    {

        private TecnologiaLicenciadaPagosRepository _repo;

        public TecnologiaLicenciadaPagosController()
        {
            _repo = new TecnologiaLicenciadaPagosRepository();
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
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                var TecnologiaLicenciadaPagos = await _repo.GetById(Id);
                return Ok(TecnologiaLicenciadaPagos);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> CreatePagos([FromBody]List<TecnologiaLicenciadaPagos> models)
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
                    await _repo.CreatePagos(models, clavePersona, nombrePersona);
                    //await _repo.Create(model);
                    return Ok("Pago(s) creado(s) exitosamente!");
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]TecnologiaLicenciadaPagos model)
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


        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]TecnologiaLicenciadaPagos model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

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
