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
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.CH
{
    public class DistincionController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(DistincionController));
        DistincionRepository _distincionRepo;
        AdjuntoRepository _adjuntoRepo;

        public DistincionController()
        {
            _distincionRepo = new DistincionRepository();
            _adjuntoRepo = new AdjuntoRepository();
        }

        [Route("api/Distincion/GetByClaveEmpleado/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpleado(string clave)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var distincion = await _distincionRepo.GetByClaveEmpleado(clave);
                return Ok(distincion);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Distincion dis)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _distincionRepo.Create(dis);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _distincionRepo.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getById(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var distincion = await _distincionRepo.getById(Id);
                return Ok(distincion);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(Distincion dis)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                
                //solución de ALAN replicada
                //if (dis.Adjunto != null)
                //    dis.AdjuntoId = dis.Adjunto.AdjuntoId;
                await _distincionRepo.Update(dis);
                return Ok(dis);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateSolicitud(Distincion dis)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _distincionRepo.UpdateSolicitud(dis);
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
        public async Task<IHttpActionResult> UpdateEstado(Distincion Distincion)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _distincionRepo.UpdateEstado(Distincion);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(Distincion Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _distincionRepo.ValidarDuplicados(Obj);
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
