using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class AutoresEstudioMercadoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutoresEstudioMercadoController));
        AutoresEstudioMercadoRepository _repository;
        public AutoresEstudioMercadoController()
        {
            _repository = new AutoresEstudioMercadoRepository();
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(List<AutoresEstudioMercado> Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(Obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> CreateUser(AutoresEstudioMercado Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.CreateUser(Obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var result = await _repository.GetById(Id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> DeleteAutor(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.DeleteAutor(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
