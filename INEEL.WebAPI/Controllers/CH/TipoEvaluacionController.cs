using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.CH.Repositories;

namespace INEEL.WebAPI.Controllers.CH
{
    public class TipoEvaluacionController : ApiController
    {

        TipoEvaluacionRepository _repository;

        public TipoEvaluacionController()
        {
            _repository = new TipoEvaluacionRepository();
        }

        // GET: api/Proyectos
        [HttpPost]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var campos = await _repository.GetTiposEvaluacion();
                return Ok(campos);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetTipoEvaluacion(int Id)
        {
            try
            {
                var campo = await _repository.GetTipoEvaluacion(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Create(TipoEvaluacion datos)
        {
            try
            {
                await _repository.CreateTipoEvaluacion(datos);
                return Ok("Tipo de evaluación creada correctamente!");
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IHttpActionResult> Update(TipoEvaluacion datos)
        {
            try
            {
                await _repository.UpdateTipoEvaluacion(datos);
                return Ok("Tipo de evaluación actualizada correctamente!");
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
                await _repository.DeleteTipoEvaluacion(Id);
                return Ok("Tipo de evaluación eliminada correctamente!");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
