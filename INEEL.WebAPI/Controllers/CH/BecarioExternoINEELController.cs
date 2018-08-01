using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class BecarioExternoINEELController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(BecarioExternoINEELController));
        BecarioExternoINEELRepository _repo;

        public BecarioExternoINEELController()
        {
            _repo = new BecarioExternoINEELRepository();
        }


        [HttpPost]
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _repo.getData(ss);

                var result = new
                {
                    ss.draw,
                    ss.recordsFiltered,
                    ss.recordsTotal,
                    data = entities
                };

                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var entities = await _repo.GetAll();
                return Ok(entities);
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
                var entity = await _repo.GetById(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetBecariosDeInvestigadores(string id)
        {
            try
            {
                var entities = await _repo.GetBecariosDeInvestigadores(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<IHttpActionResult> ActualizaRegistroBecaEmpleado(int id, string clave)
        {
            try
            {
                await _repo.ActualizaRegistroBecaEmpleado(id, clave);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetEstanciasDeInvestigadoresEnInstituto(string id)
        {
            try
            {
                var entities = await _repo.GetEstanciasDeInvestigadoresEnInstituto(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(BecarioExternoINEEL model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);

                }
                await _repo.Create(model);
                return Ok("Registro creado correctamente");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(BecarioExternoINEEL model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repo.Update(model);
                return Ok("Registro actualizado correctamente");
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
                await _repo.Delete(id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
