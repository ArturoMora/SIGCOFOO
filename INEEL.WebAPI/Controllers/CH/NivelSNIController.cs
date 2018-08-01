using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    [Authorize]
    public class NivelSNIController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(NivelSNIController));
        NivelSNIRepository _nivelRepo;
        public NivelSNIController()
        {
            _nivelRepo = new NivelSNIRepository();
        }
        //obener niveles
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var niveles = await _nivelRepo.GetAll();
                return Ok(niveles);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var niveles = await _nivelRepo.GetAllAdmin();
                return Ok(niveles);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Obtener nivel curso por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var NivelSNI = await _nivelRepo.GetById(id);
                return Ok(NivelSNI);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear nivel curso
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(NivelSNI NivelSNI)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _nivelRepo.Create(NivelSNI);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar nivel curso
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(NivelSNI NivelSNI)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _nivelRepo.Update(NivelSNI);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar nivel curso
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(NivelSNI NivelSNI)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _nivelRepo.UpdateEstado(NivelSNI);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
