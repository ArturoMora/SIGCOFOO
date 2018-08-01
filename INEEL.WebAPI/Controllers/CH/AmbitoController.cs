using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AmbitoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AmbitoController));
        AmbitoRepository _AmbitoRepo;

        public AmbitoController()
        {
            _AmbitoRepo = new AmbitoRepository();
        }
        //Obtener todos los ambitos
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Ambito = await _AmbitoRepo.GetAll();
                return Ok(Ambito);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }

        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var Ambito = await _AmbitoRepo.GetAllAdmin();
                return Ok(Ambito);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }

        }
        //Obtener un ambito por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var Ambito = await _AmbitoRepo.GetById(id);
                return Ok(Ambito);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Crear Ambito
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(Ambito Ambito)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _AmbitoRepo.Create(Ambito);
                return Ok("Registro creado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Ambito
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Ambito Ambito)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _AmbitoRepo.Update(Ambito);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Estado
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Ambito Ambito)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _AmbitoRepo.UpdateEstado(Ambito);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar Ambito
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _AmbitoRepo.Delete(id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
