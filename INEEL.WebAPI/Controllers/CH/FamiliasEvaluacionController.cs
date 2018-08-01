using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.CH.Repositories;


namespace INEEL.WebAPI.Controllers.CH
{
    public class FamiliasEvaluacionController : ApiController
    {
        FamiliaEvaluacionRepository _repository;

        public FamiliasEvaluacionController()
        {
            _repository = new FamiliaEvaluacionRepository();
        }

        // GET: api/Proyectos
        [HttpPost]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var campos = await _repository.GetFamilias();
                return Ok(campos);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetFamilia(int Id)
        {
            try
            {
                var campo = await _repository.GetFamilia(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Create(FamiliaEvaluacion datos)
        {
            try
            {
                await _repository.CreateFamilia(datos);
                return Ok("Familia creada correctamente!");
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IHttpActionResult> Update(FamiliaEvaluacion datos)
        {
            try
            {
                await _repository.UpdateFamilia(datos);
                return Ok("Familia  actualizada correctamente!");
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
                await _repository.DeleteFamilia(Id);
                return Ok("Familia eliminada correctamente!");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}