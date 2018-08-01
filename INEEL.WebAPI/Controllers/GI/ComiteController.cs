using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.WebAPI.Controllers.GI
{
    public class ComiteController : ApiController
    {

        private ComiteRepository _repo;
        public ComiteController()
        {
            _repo = new ComiteRepository();
        }
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]ComiteGI model)
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
            catch (ApplicationException e)
            {
                return BadRequest(e.Message);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]ComiteGI model)
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
            catch (ApplicationException e)
            {
                return BadRequest(e.Message);
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
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                var ContribucionAutor = await _repo.GetById(Id);
                return Ok(ContribucionAutor);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}
