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
    public class ContactosPerfilesController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ContactosPerfilesController));
        ContactoPerfilRepository _contactosPerfilRepo;

        public ContactosPerfilesController()
        {
            _contactosPerfilRepo = new ContactoPerfilRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _contactoPerfil = await _contactosPerfilRepo.Get(Id);
                return Ok(_contactoPerfil);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                //solo cometno para mostrar algo
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetPerfil (int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var _perfilContacto = await _contactosPerfilRepo.GetPerfilContacto(Id);
                return Ok(_perfilContacto);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(ContactoPerfil contactoPerfil)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _contactosPerfilRepo.Create(contactoPerfil);
                return Ok("Registro agregado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(ContactoPerfil contactoPerfil)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _contactosPerfilRepo.Update(contactoPerfil);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _contactosPerfilRepo.Delete(Id);
                return Ok("Registro eliminado correctamente");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
