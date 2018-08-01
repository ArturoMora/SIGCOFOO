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
    public class PeriodoFIController : ApiController
    {

        private PeriodoFIRepository _repo;

        public PeriodoFIController()
        {
            _repo = new PeriodoFIRepository();
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
        public async Task<IHttpActionResult> GetInPeriodoByActivo()
        {
            try
            {
                var PeriodoFI = await _repo.GetInPeriodoByActivo();
                return Ok(PeriodoFI);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetActivo()
        {
            try
            {
                var PeriodoFI = await _repo.GetActivo();
                return Ok(PeriodoFI);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> ExisteActivo()
        {
            try
            {
                var PeriodoFI = await _repo.ExisteActivo();
                return Ok(PeriodoFI);
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
                var PeriodoFI = await _repo.GetById(Id);
                return Ok(PeriodoFI);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]PeriodoFI model)
        {

            try
            {
                model.FechaInicioReal = model.FechaInicioPlaneada;
                model.FechaTerminoReal = model.FechaTerminoPlaneada;
                await _repo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (ApplicationException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]PeriodoFI model)
        {

            try
            {
                await _repo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (ApplicationException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado([FromBody]PeriodoFI model)
        {

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
