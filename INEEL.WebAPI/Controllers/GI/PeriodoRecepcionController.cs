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
    public class PeriodoRecepcionController : ApiController
    {

        private PeriodoRecepcionRepository _repo;

        public PeriodoRecepcionController()
        {
            _repo = new PeriodoRecepcionRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetInPeriodoRecepcionByActivo()
        {
            try
            {
                var PeriodoFI = await _repo.GetInPeriodoRecepcionByActivo();
                return Ok(PeriodoFI);
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
        public async Task<IHttpActionResult> GetByIdPeriodoFI(int Id)
        {
            try
            {
                var PeriodoRecepcion = await _repo.GetByIdPeriodoFI(Id);
                return Ok(PeriodoRecepcion);
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
                var PeriodoRecepcion = await _repo.GetById(Id);
                return Ok(PeriodoRecepcion);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]PeriodoRecepcion model)
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
        public async Task<IHttpActionResult> Update([FromBody]PeriodoRecepcion model)
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
