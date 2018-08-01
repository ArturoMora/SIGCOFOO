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
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class AdjuntoGeneralesController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AdjuntoGeneralesController));
        AdjuntoRepository _repository;

        public AdjuntoGeneralesController()
        {
            _repository = new AdjuntoRepository();
        }


        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Adjunto Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.RegistrarAdjunto(Obj);
                return Ok(Obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
