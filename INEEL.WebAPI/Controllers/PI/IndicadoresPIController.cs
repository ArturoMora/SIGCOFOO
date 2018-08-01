using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.PI.Models;
using log4net;
using INEEL.DataAccess.GEN.Repositories.PI;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.WebAPI.Controllers.PI
{
    public class IndicadoresPIController : ApiController
    {
        indicadoresPIRepository _irep;

        private static readonly ILog log = LogManager.GetLogger(typeof(IndicadoresPIController));

        public IndicadoresPIController()
        {
            _irep = new indicadoresPIRepository();
        }


        [HttpGet]
        public async Task<IHttpActionResult> getpiLicenciada(string id)
        {
            try
            {
               

                var obj = await _irep.piLicenciada(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> getpiLicenciadaXInvestigador(string id)
        {
            try
            {
                
                var obj = await _irep.piLicenciadaxInvestigador(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}
