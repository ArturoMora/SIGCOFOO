using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.WebAPI.Controllers.GI
{
    public class TipoAccesoGIController : ApiController
    {
        private TipoAccesoRepository _tipoAccesoRepository;

        public TipoAccesoGIController()
        {
            _tipoAccesoRepository = new TipoAccesoRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetByID(int id)
        {
            try
            {
                var entities = await _tipoAccesoRepository.GetByID(id);
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
                var entities = await _tipoAccesoRepository.GetAll();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]TipoAccesoGI model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _tipoAccesoRepository.Update(model);
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
    }
}
