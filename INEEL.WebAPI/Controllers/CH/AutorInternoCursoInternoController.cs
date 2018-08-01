using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AutorInternoCursoInternoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutorInternoCursoInternoController));
        AutorInternoCursoInternoRepository _repository;
        PersonasRepository _PersonasRepository;
        public AutorInternoCursoInternoController()
        {
            _repository = new AutorInternoCursoInternoRepository();
            _PersonasRepository = new PersonasRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByObj(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByObj(id);

                foreach (var soli in result)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombreCompleto = p.NombreCompleto;
                }

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(AutorInternoCursoInterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> CreateExt(AutorExternoCursoInterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.CreateExt(Obj);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> DeleteExt(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.DeleteExt(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAutor(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var objetos = await _repository.GetAutor(id);
                return Ok(objetos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetExtById(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var objetos = await _repository.GetExtById(id);
                return Ok(objetos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> updateAutoresExternos([FromBody]List<AutorExternoCursoInterno> models)
        {
            try
            {
                await _repository.UpdateAll(models);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> updateAutoresInternos([FromBody]List<AutorInternoCursoInterno> models)
        {
            try
            {
                await _repository.UpdateAllInt(models);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}
