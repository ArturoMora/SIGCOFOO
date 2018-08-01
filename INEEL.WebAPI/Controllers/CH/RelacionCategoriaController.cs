using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    [Authorize]
    public class RelacionCategoriaController : ApiController
    {


        RelacionCategoriaRepository _repository;
        public RelacionCategoriaController()
        {
            _repository = new RelacionCategoriaRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var campo = await _repository.GetAll();
                return Ok(campo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                var campo = await _repository.Get(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Create(RelacionCategoriaNominaCompetencias obj)
        {
            try
            {
                await _repository.Create(obj);
                return Ok("Calificación creada correctamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IHttpActionResult> Update(RelacionCategoriaNominaCompetencias obj)
        {
            try
            {
                await _repository.Update(obj);
                return Ok("Calificación actualizada correctamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                await _repository.Delete(Id);
                return Ok("Calificación eliminada correctamente!");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

   

    }
}
