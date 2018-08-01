using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Repositories.CR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ClaveEmpresaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ClaveEmpresaController));
        ClaveEmpresaRepository _cveEmpresaRepo;

        public ClaveEmpresaController()
        {

            _cveEmpresaRepo = new ClaveEmpresaRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _claveEmpresas = await _cveEmpresaRepo.get();
                return Ok(_claveEmpresas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _claveEmpresa = await _cveEmpresaRepo.getById(Id);
                return Ok(_claveEmpresa);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(ClaveEmpresas cveEmpresa)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _cveEmpresaRepo.create(cveEmpresa);
                return Ok("Registro creado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(ClaveEmpresas cveEmpresa)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _cveEmpresaRepo.update(cveEmpresa);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Delete(ClaveEmpresas cveEmpresa)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _cveEmpresaRepo.deleteLogic(cveEmpresa);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
