
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.IO;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Web;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class PaisesController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(PaisesController));
        PaisesRepository _paisesRepo;
        public PaisesController()
        {
            _paisesRepo = new PaisesRepository();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetPais()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _paises = await _paisesRepo.GetPaises();
                return Ok(_paises);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetEstado(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _estados = await _paisesRepo.GetEstado(Id);
                return Ok(_estados);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetMunicipio(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _municipio = await _paisesRepo.GetMunicipio(Id);
                return Ok(_municipio);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}