using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Repositories.PI;

namespace INEEL.WebAPI.Controllers.PI
{
    public class AutoresIntDAController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutoresIntDAController));
        AutoresIntDARepository _repository;
        PersonasRepository _PersonasRepository;
        public AutoresIntDAController()
        {
            _repository = new AutoresIntDARepository();
            _PersonasRepository = new PersonasRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByDAExterno(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetByDAExterno(id);

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
        [Authorize] public async Task<IHttpActionResult> Create(AutoresIntDA Obj)
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
