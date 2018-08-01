using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class IdiomaController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(IdiomaController));
        IdiomaRepository _idiomaRepo;

        public IdiomaController()
        {
            _idiomaRepo = new IdiomaRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var idiomas = await _idiomaRepo.GetAll();
                return Ok(idiomas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IHttpActionResult> GetAllAdmin()
        {
            try
            {
                var idiomas = await _idiomaRepo.GetAllAdmin();
                return Ok(idiomas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)
        {
            try
            {
                var idiomas = await _idiomaRepo.GetById(id);
                return Ok(idiomas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Idioma idioma)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _idiomaRepo.Create(idioma);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(Idioma idioma)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _idiomaRepo.Update(idioma);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Idioma idioma)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _idiomaRepo.UpdateEstado(idioma);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _idiomaRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(Idiomas Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _idiomaRepo.ValidarDuplicados(Obj);
                return Ok(exis);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
