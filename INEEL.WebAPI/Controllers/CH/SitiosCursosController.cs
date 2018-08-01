using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.CH.Models;

namespace INEEL.WebAPI.Controllers.CH
{
    public class SitiosCursosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SitiosCursosController));
        SitiosCursosRepository _repository;

        public SitiosCursosController()
        {
            _repository = new SitiosCursosRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdOK(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var resu = await _repository.GetById(id);
                return Ok(resu);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(SitioWebCurso Obj)
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
    }
}
