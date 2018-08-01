using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    [Authorize]
    public class UsuarioController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(UsuarioController));
        UsuarioRepository _usuarioRepo;
        public UsuarioController()
        {
            _usuarioRepo = new UsuarioRepository();
        }

        //Obtener usuario especifico
        [HttpGet]
        public async Task<IHttpActionResult> getUsuario(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var usuario = await _usuarioRepo.GetUsuario(id);
                return Ok(usuario);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
