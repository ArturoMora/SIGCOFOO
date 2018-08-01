using System;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.CR.Models;
using System.Threading.Tasks;
using System.Web;
using INEEL.DataAccess.GEN.Models.GEN;
using System.IO;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Controllers.CR
{
    public class HistorialUnidadesOrganizacionalesEmpresasController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(HistorialUnidadesOrganizacionalesEmpresasController));
        HistorialUnidadesOrganizacionalesEmpresasRepository _repo;

        public HistorialUnidadesOrganizacionalesEmpresasController()
        {
            _repo = new HistorialUnidadesOrganizacionalesEmpresasRepository();
        }


        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Create(HistorialUnidadesOrganizacionalesEmpresas model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _repo.Create(model);
                return Ok(entity);
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
                log.Info(new MDCSet(this.ControllerContext.RouteData));
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
        public async Task<IHttpActionResult> GetAllByEmpresa(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _empresas = await _repo.GetAllByEmpresa(id);
                return Ok(_empresas);
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
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _empresa = await _repo.GetById(id);
                return Ok(_empresa);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllByUnidad(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _empresas = await _repo.GetAllByUnidad(id);
                return Ok(_empresas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(HistorialUnidadesOrganizacionalesEmpresas model)
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
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repo.Delete(Id);
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
