using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.CH.Repositories;


namespace INEEL.WebAPI.Controllers.CH
{
    public class NivelEvaluacionController : ApiController
    {
        NivelEvaluacionRepository _repository;

        public NivelEvaluacionController()
        {
            _repository = new NivelEvaluacionRepository();
        }

        // GET: api/Proyectos
        [HttpPost]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var campos = await _repository.GetNivelesEvaluacion();
                return Ok(campos);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
                
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetNivel(int Id)
        {
            try
            {
                var campo = await _repository.GetNivelEvaluacion(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Create(NivelEvaluacion datos)
        {
            try
            {
                await _repository.CreateNivelEvaluacion(datos);
                return Ok("Nivel de evaluación creado correctamente!");
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IHttpActionResult> Update(NivelEvaluacion datos)
        {
            try
            {
                await _repository.UpdateNivelEvaluacion(datos);
                return Ok("Nivel de evaluación actualizado correctamente!");
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
                await _repository.DeleteNivelEvaluacion(Id);
                return Ok("Nivel de evaluación eliminado correctamente!");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}