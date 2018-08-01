using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;

namespace INEEL.WebAPI.Controllers.GI
{

    public class IdeaInnovadoraController : ApiController
    {
        private ContribucionProponenteRepository _ContriRepo;
        private IdeaInnovadoraRepository _repo;
        private AutoresIdeaRepository _autoresRepo;
        private EvaluadorIdeaRepository _evalRepo;

        public IdeaInnovadoraController()
        {
            _repo = new IdeaInnovadoraRepository();
            _ContriRepo = new ContribucionProponenteRepository();
            _autoresRepo = new AutoresIdeaRepository();
            _evalRepo = new EvaluadorIdeaRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> CountIdeaInnovadora()
        {
            try
            {
                var entities = await _repo.CountIdeaInnovadora();
                return Ok(entities);
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
        public async Task<IHttpActionResult> GetAllForModal(string id)
        {
            try
            {
                var entities = await _repo.GetAllForModal(id);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaIdeas(IdeaInnovadora p)
        {
            try
            {
                var entities = await _repo.GetConsultaIdeas(p);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> getAllAceptadas()
        {
            try
            {
                var entities = await _repo.getAllAceptadas();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> getAllAceptadas2()
        {
            try
            {
                var entities = await _repo.getAllAceptadas2();
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
                var entity = await _repo.GetById(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ComentariosSolicitudIdea(string Id)
        {
            try
            {
                var entity = await _repo.ComentariosSolicitudIdea(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ComentariosSolicitudAprobadaIdea(string Id)
        {
            try
            {
                var entity = await _repo.ComentariosSolicitudAprobadaIdea(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> ComentariosSolicitudAModificar(string Id)
        {
            try
            {
                var entity = await _repo.ComentariosSolicitudAModificar(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> EvidenciaDownload(int id, String clave)
        {
            try
            {
                var entity = await _repo.EvidenciaDownload(id, clave);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string id)//id is Clave
        {
            try
            {
                var entity = await _repo.GetByClave(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult>
            Create(
            IdeaInovadoraCreate model
            )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _repo.CreateConAutores(model.IdeaInnovadora, model.ListaAutores);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPut]
        public async Task<IHttpActionResult> Update(IdeaInovadoraCreate model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _repo.Update(model.IdeaInnovadora, model.ListaAutores);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(IdeaInnovadora model)
        {


            try
            {
                await _repo.UpdateEstado(model);
                return Ok("Estado actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPut]
        public async Task<IHttpActionResult> UpdateTipoAcceso(IdeaInnovadora model)
        {


            try
            {
                await _repo.UpdateTipoAcceso(model);
                return Ok("Tipo acceso actualizado exitosamente!");
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
                await _repo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetAllContribucion()
        {
            try
            {
                var obj = await _ContriRepo.GetAll();
                return Ok(obj);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProponentes(int id)
        {
            try
            {
                var obj = await _autoresRepo.GetProponentesByIdeaId(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetGrupoEvaluadoExist(int id)
        {
            try
            {
                var obj = await _evalRepo.GetByIdExist(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
    public class IdeaInovadoraCreate
    {
        public IdeaInnovadora IdeaInnovadora { get; set; }
        public List<AutoresIdea> ListaAutores { get; set; }
    }
}
