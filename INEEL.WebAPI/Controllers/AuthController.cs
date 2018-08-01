using INEEL.DataAccess.Models;
using INEEL.DataAccess.Repositories;
using Microsoft.AspNet.Identity;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers
{
    public class AccountController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(AccountController));
        private AuthRepository _repo = null;

        public AccountController()
        {
            _repo = new AuthRepository();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                IdentityResult result = await _repo.RegisterUser(userModel);

                IHttpActionResult errorResult = GetErrorResult(result);

                if (errorResult != null)
                {
                    return errorResult;
                }

                return Ok("Registro creado exitosamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }

        }
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(UserModel userModel)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await new AccesoSistemaRepository().ChangePassword(userModel);

                return Ok("Contraseña actualizada correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return BadRequest(e.Message);
            }

        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

    }
}
