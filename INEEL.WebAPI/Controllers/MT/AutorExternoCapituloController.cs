using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.MT
{
    public class AutorExternoCapituloController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutorExternoCapituloController));

        AutorExternoCapituloRepository _repository;

        public AutorExternoCapituloController()
        {
            _repository = new AutorExternoCapituloRepository();

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByCapitulos(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByCapitulos(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(AutorExternoCapitulo Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
                return Ok(Obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> CreateAll(AutorExternoCapitulo[] model)
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
