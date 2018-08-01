using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class ValidacionExistController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ValidacionExistController));
        ValidarExistRepository _repo;

        public ValidacionExistController()
        {
            _repo = new ValidarExistRepository();
        }


        [HttpPost]
        public async Task<IHttpActionResult> validar(ValidacionExist model)
        {

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result=await _repo.Validar(model);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        
        //Valida los catalogos de CR
        [HttpPost]
        public async Task<IHttpActionResult> validarCR(ValidacionExist model)
        {

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repo.ValidarCR(model);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Valida los catalogos de CP
        [HttpPost]
        public async Task<IHttpActionResult> validarCP(ValidacionExist model)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repo.ValidarCP(model);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> validarExistencia(ValidacionExist model)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repo.validarExistencia(model);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
    }
}
