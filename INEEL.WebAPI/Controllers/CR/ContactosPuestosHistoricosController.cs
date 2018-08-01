using INEEL.DataAccess.CR.Models;
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
    public class ContactosPuestosHistoricosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ContactosPuestosHistoricosController));
        ContactoPuestoHistoricoRepository _contactosPuestoRepo;

        public ContactosPuestosHistoricosController()
        {
            _contactosPuestoRepo = new ContactoPuestoHistoricoRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _contactoPuesto = await _contactosPuestoRepo.Get(Id);
                return Ok(_contactoPuesto);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetPuesto(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _puestoContacto = await _contactosPuestoRepo.GetPuestoContacto(Id);
                return Ok(_puestoContacto);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(ContactoPuestoHistorico contactoPuesto)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _contactosPuestoRepo.Create(contactoPuesto);
                return Ok("Puesto agregado al historial del contacto correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(ContactoPuestoHistorico contactoPuesto)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _contactosPuestoRepo.Update(contactoPuesto);
                return Ok("Puesto actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _contactosPuestoRepo.Delete(Id);
                return Ok("Puesto eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
