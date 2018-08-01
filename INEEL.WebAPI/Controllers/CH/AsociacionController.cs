using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AsociacionController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(AsociacionController));
        AsociacionRepository _asociacionRepo;

        public AsociacionController()
        {
            _asociacionRepo = new AsociacionRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var asociacion = await _asociacionRepo.GetAll();
                return Ok(asociacion);
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
                var asociacion = await _asociacionRepo.GetAllAdmin();
                return Ok(asociacion);
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
                var asociacion = await _asociacionRepo.GetById(id);
                return Ok(asociacion);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Asociacion asociacion)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _asociacionRepo.Create(asociacion);
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
        public async Task<IHttpActionResult> Update(Asociacion asociacion)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _asociacionRepo.Update(asociacion);
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
        public async Task<IHttpActionResult> UpdateEstado(Asociacion asociacion)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _asociacionRepo.UpdateEstado(asociacion);
                return Ok();
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
                await _asociacionRepo.Delete(Id);
                return Ok("Asociación eliminada correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(Asociaciones Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _asociacionRepo.ValidarDuplicados(Obj);
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
