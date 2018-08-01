using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ListaAlianzaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ListaAlianzaController));
        private ListaAlianzaRepository _entityRepo;
       
        public ListaAlianzaController()
        {
            _entityRepo = new ListaAlianzaRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetAlianzasByConv(ParametrosAliados parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reporteListaAlianzas = await _entityRepo.GetAlianzasByConv(parametros);
                return Ok(reporteListaAlianzas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetResAlianzasByConv(ParametrosAliados parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reporteResListaAlianzas = await _entityRepo.GetResAlianzasByConv(parametros);
                return Ok(reporteResListaAlianzas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetResAlianzasPDF(ParametrosAliados parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reporteResListaAlianzas = await _entityRepo.GetResAlianzasPDF(parametros);
                return Ok(reporteResListaAlianzas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


    }
}
