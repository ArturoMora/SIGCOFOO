using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.CH.Repositories;

namespace INEEL.WebAPI.Controllers.CH
{
    public class RelacionNivelController : ApiController
    {

        RelacionNivelEvaluacionRepository _repository;

        public RelacionNivelController()
        {
            _repository = new RelacionNivelEvaluacionRepository();
        }

        // GET: api/Proyectos
        [HttpPost]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var campos = await _repository.GetDatos();
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
                var campo = await _repository.GetDatosPorId(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }
        

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Create(RelacionNivelEvaluacion datos)
        {
            try
            {
                await _repository.Create(datos);
                return Ok("Nivel de evaluación creado correctamente!");
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IHttpActionResult> Update(RelacionNivelEvaluacion datos)
        {
            try
            {
                await _repository.Update(datos);
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
                await _repository.Delete(Id);
                return Ok("Nivel de evaluación eliminado correctamente!");

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
