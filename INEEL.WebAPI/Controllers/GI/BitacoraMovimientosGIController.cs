using INEEL.DataAccess.GEN.Models.GI;
using INEEL.DataAccess.GEN.Repositories.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GI
{
    public class BitacoraMovimientosGIController : ApiController
    {

        private BitacoraMovimientosGIRepository _repo;

        public BitacoraMovimientosGIController()
        {
            _repo = new BitacoraMovimientosGIRepository();
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
        /// retorna todos los registros dado los dos argumentos
        /// </summary>
        /// <param name="id">RegistroId</param>
        /// <param name="clave">OcsId tipo de OC/registro</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByRegistroId(int id, string clave)
        {
            try
            {
                var entities = await _repo.GetAllByRegistroId(id, clave);
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
                var BitacoraMovimientosGI = await _repo.GetById(Id);
                return Ok(BitacoraMovimientosGI);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]BitacoraMovimientosGI model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _repo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]BitacoraMovimientosGI model)
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
