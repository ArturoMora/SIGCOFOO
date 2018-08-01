using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CR;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ProyectosEmpresaController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(ProyectosEmpresaController));
        ProyectosEmpresaRepository _proyectosEmpresaRepo;

        public ProyectosEmpresaController()
        {
            _proyectosEmpresaRepo = new ProyectosEmpresaRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var _proyectos = await _proyectosEmpresaRepo.getAll();
                return Ok(_proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllTecnicos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var _proyectos = await _proyectosEmpresaRepo.getAllTecnicos();
                return Ok(_proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetAllTecnicosServerSide([FromBody]DataServerSide ss)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _proyectosEmpresaRepo.getAllTecnicosServerSide(ss);

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
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



        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> Get(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectos = await _proyectosEmpresaRepo.Get(id);
                return Ok(_proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> CountProyectosVigentes(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectos = await _proyectosEmpresaRepo.CountProyectosVigentes(id);
                return Ok(_proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> CountProyectosHistoricos(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectos = await _proyectosEmpresaRepo.CountProyectosHistoricos(id);
                return Ok(_proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAsignado(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectos = await _proyectosEmpresaRepo.GetAsginado(id);
                return Ok(_proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        [Authorize]
        public async Task<IHttpActionResult> Create(Proyecto proyecto)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _proyectosEmpresaRepo.AsignarProyecto(proyecto);
                return Ok("Se ha asignado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(Proyecto proyecto)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _proyectosEmpresaRepo.Update(proyecto);
                return Ok("Se ha actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Delete(Proyecto proyecto)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _proyectosEmpresaRepo.Delete(proyecto);
                return Ok("Se ha eliminado el proyecto de la empresa correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllProyectosAsociados(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectosAsociados = await _proyectosEmpresaRepo.GetProyectosAsociados(id);
                return Ok(_proyectosAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosNoVigentes(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectosAsociados = await _proyectosEmpresaRepo.GetProyectosNoVigentes(id);
                return Ok(_proyectosAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosAsociadosUnidadesEmpresas(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectosAsociados = await _proyectosEmpresaRepo.GetProyectosAsociadosUnidadesEmpresas(id);
                return Ok(_proyectosAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosAsociadosInactivosUnidadesEmpresas(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var _proyectosAsociados = await _proyectosEmpresaRepo.GetProyectosAsociadosInactivosUnidadesEmpresas(id);
                return Ok(_proyectosAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetProyectosAsociadosInactivosNodoEmpresas(UnidadOrganizacionalEmpresas id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id.ClaveUnidad));
                var _proyectosAsociados = await _proyectosEmpresaRepo.GetProyectosAsociadosInactivosUnidadesEmpresas(id.ClaveUnidad);
                return Ok(_proyectosAsociados);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosAsociadosVigentes(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var proyectos = await _proyectosEmpresaRepo.GetProyectosAsociadosVigentes(id);
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosVigentesEmpresa(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var proyectos = await _proyectosEmpresaRepo.GetProyectosVigentesEmpresa(id);
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosAsociadosVigentesUnidadesEmpresas(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var proyectos = await _proyectosEmpresaRepo.GetProyectosAsociadosVigentesUnidadesEmpresas(id);
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> GetProyectosAsociadosVigentesNodoEmpresas(UnidadOrganizacionalEmpresas id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id.ClaveUnidad));
                var proyectos = await _proyectosEmpresaRepo.GetProyectosAsociadosVigentesUnidadesEmpresas(id.ClaveUnidad);
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

    }
}
