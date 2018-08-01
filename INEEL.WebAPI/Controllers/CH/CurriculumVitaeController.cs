using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Repositories.PI;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.WebAPI.Controllers.CH
{
    public class CurriculumVitaeController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(CurriculumVitaeController));
        PersonalProyectoRepository _participacion;
        DerechosAutorRepository _da;
        PropiedadIndustrialRepository _pi;

        public CurriculumVitaeController()
        {
            _participacion = new PersonalProyectoRepository();
            _da = new DerechosAutorRepository();
            _pi = new PropiedadIndustrialRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var participacionResult = await _participacion.GetForCV(id);
                var daResult = await _da.GetForCV(id);
                var piResult = await _pi.GetForCV(id);


                var obj = await new CurriculumVitaeRepository().GetForCV(id, daResult, piResult, participacionResult); //propiedadindustrial


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
