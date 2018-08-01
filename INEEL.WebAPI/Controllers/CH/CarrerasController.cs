
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class CarrerasController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CarrerasController));
        CarreraRepository _carrerasRepo;

        public CarrerasController()
        {
            _carrerasRepo = new CarreraRepository();
        }
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var carreras = await _carrerasRepo.GetAll();
                return Ok(carreras);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var carreras = await _carrerasRepo.GetAllAdmin();
                return Ok(carreras);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var carrera = await _carrerasRepo.GetById(Id);
                return Ok(carrera);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Carrera carrera)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _carrerasRepo.Create(carrera);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Carrera carrera)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _carrerasRepo.Update(carrera);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Carrera carrera)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _carrerasRepo.UpdateEstado(carrera);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _carrerasRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
