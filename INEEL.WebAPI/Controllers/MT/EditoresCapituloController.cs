using System;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.MT
{
    public class EditoresCapituloController : ApiController
    {
        EditoresCapituloRepository _repository;
        PersonasRepository _PersonasRepository;
        public EditoresCapituloController()
        {
            _repository = new EditoresCapituloRepository();
            _PersonasRepository = new PersonasRepository();
        }

        //[HttpGet]
        //public async Task<IHttpActionResult> GetByCursos(int id)
        //{
        //    try
        //    {
        //        var result = await _repository.s(id);

        //        foreach (var soli in result)
        //        {
        //            var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
        //            soli.NombreCompleto = p.NombreCompleto;
        //        }

        //        return Ok(result);
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}

        [HttpPost]
        public async Task<IHttpActionResult> Create(EditoresCapitulo Obj)
        {
            try
            {
                var result = await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
