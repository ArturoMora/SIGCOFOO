using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Models.GI;
using INEEL.DataAccess.GEN.Repositories.GI;

namespace INEEL.WebAPI.Controllers.GI
{
    public class EvaluadorIdeaController : ApiController
    {
        private EvaluadorIdeaRepository _evalRepo;

        public EvaluadorIdeaController()
        {
            _evalRepo = new EvaluadorIdeaRepository();
        }


        [HttpPut]
        public async Task<IHttpActionResult> UpdateComentarios(EvaluadoresIdea model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _evalRepo.UpdateComentarios(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetComentarios(int Id)
        {
            try
            {
                var entity = await _evalRepo.GetComentarios(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
