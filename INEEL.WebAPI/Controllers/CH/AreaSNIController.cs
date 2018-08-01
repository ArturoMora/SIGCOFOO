using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AreaSNIController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AreaSNIController));
        AreaSNIRepository _areaRepo;
        public AreaSNIController()
        {
            _areaRepo = new AreaSNIRepository();
        }
        //obtener areas
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var areas = await _areaRepo.GetAll();
                return Ok(areas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var areas = await _areaRepo.GetAllAdmin();
                return Ok(areas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        //Obtener un ambito por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var area = await _areaRepo.GetById(id);
                return Ok(area);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar 
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(AreaSNI area)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _areaRepo.Update(area);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Estado
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(AreaSNI area)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _areaRepo.UpdateEstado(area);
                return Ok();
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Crear area
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(AreaSNI area)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _areaRepo.Create(area);
                return Ok("Registro creado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
