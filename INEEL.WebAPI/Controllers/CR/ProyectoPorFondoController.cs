using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.CR.Models;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ProyectoPorFondoController : ApiController
    {
    
        private ProyectoPorFondoRepository _entityRepo;
    
        public ProyectoPorFondoController()
        {
            _entityRepo = new ProyectoPorFondoRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var entities = await _entityRepo.GetAll();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id)
        {
            try
            {
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]ProyectoPorFondo model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]ProyectoPorFondo model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _entityRepo.Update(model);
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
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


    }
}
