using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.Threading.Tasks;

namespace INEEL.WebAPI.Controllers.MT
{
    
    public class SolicitudRevisionITFController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudRevisionITFController));
        private SolicitudRevisionITFRepository rp;
        public SolicitudRevisionITFController()
        {
            rp = new SolicitudRevisionITFRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetByResponsableUO(String Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await rp.GetByResponsableUO(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

       
    }
}
