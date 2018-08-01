using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.WebAPI.Utilidades;

namespace INEEL.WebAPI.Controllers.MT
{
    public class AutorInternoCapituloController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutorInternoCapituloController));
        AutorInternoCapituloRepository _repository;
        PersonasRepository _PersonasRepository;
        public AutorInternoCapituloController()
        {
            _repository = new AutorInternoCapituloRepository();
            _PersonasRepository = new PersonasRepository();
        }
        [Route("api/AutorInternoCapitulo/GetAllByAutorAndStatus/{clave}/{estados}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByAutorAndStatus(string clave, String estados)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                EstadosToInt param = new EstadosToInt(estados);
                var result = await _repository.GetAllByAutorAndStatus(clave, param.ListEstados);

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByAutor(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetAllByAutor(id);

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(AutorInternoCapitulo Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
                return Ok(Obj);//regresamos el objeto par saber su id una vez guardado
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> CreateAll(AutorInternoCapitulo[] model)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                object result = null;
                for (int cont = 0; cont < model.Length;)
                {
                    result = await _repository.Create(model[cont]);
                    cont++;
                }
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
    }
}
