using INEEL.DataAccess.GEN.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class RecuperaPasswordController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(AccesoSistemaController));
        RecuperaPasswordRepository _RecuperPassRepo;

        public RecuperaPasswordController()
        {
            _RecuperPassRepo = new RecuperaPasswordRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> RecuperarPasswordGC(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var codigo = await _RecuperPassRepo.GetGeneraCodigo(id);
                return Ok(codigo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> ValidarCodigo(RecuperaPassword recuperapassword)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var codigo = await _RecuperPassRepo.ValidarCodigo(recuperapassword.ClavePersona,recuperapassword.codigo, recuperapassword.password);
                return Ok(codigo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return BadRequest(e.Message);
            }
        }
    }
}
