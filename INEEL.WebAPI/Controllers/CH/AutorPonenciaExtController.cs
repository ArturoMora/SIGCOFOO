using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System.Collections.Generic;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AutorPonenciaExtController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutorPonenciaExtController));

        AutorPonenciaExtRepository _repository;

        public AutorPonenciaExtController()
        {
            _repository = new AutorPonenciaExtRepository();

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByPonencia(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByPonencia(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(AutorPonenciaExt Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
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

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]List<AutorPonenciaExt> models)
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
    }
}
