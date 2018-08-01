using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.CH.Repositories;


namespace INEEL.WebAPI.Controllers.CH
{
    public class CompetenciasEvaluacionController : ApiController
    {
        ComptenciasEvaluacionRepository _repository;

        public CompetenciasEvaluacionController()
        {
            _repository = new ComptenciasEvaluacionRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var campos = await _repository.GetCompetencias();
                return Ok(campos);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetencia(int Id)
        {
            try
            {
                var campo = await _repository.GetCompetencia(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Create(CompetenciasEvaluacion datos)
        {
            try
            {
                await _repository.CreateCompetencias(datos);
                return Ok("Competencia creada correctamente!");
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IHttpActionResult> Update(CompetenciasEvaluacion datos)
        {
            try
            {
                await _repository.UpdateCompetencias(datos);
                return Ok("Competencia actualizado correctamente!");
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
                await _repository.DeleteCompetencias(Id);
                return Ok("Competencia eliminada correctamente!");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}