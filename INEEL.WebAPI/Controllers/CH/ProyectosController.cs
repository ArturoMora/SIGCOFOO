using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System.Collections.Generic;
using System.Linq;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Controllers.CH
{
    public class ProyectosController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(ProyectosController));
        ProyectoRepository _proyectosRepo;

        public ProyectosController()
        {
            _proyectosRepo = new ProyectoRepository();
        }

        /// <summary>
        /// Facturación planeada por gerencia
        /// de acuerdo a datos de proyectos
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> FacturacionPlaneadaGroupByUnidad(int id)
        {
            try
            {
                int year = id;
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _proyectosRepo.FacturacionPlaneadaGroupByUnidad(year);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        /// <summary>
        /// Facturación real por gerencia
        /// de acuerdo a datos de proyectos
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> FacturacionRealGroupByUnidad(int id)
        {
            try
            {
                int year = id;
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _proyectosRepo.FacturacionRealGroupByUnidad(year);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetProyectosForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _proyectosRepo.GetProyectosForDetailsBusqueda(parametro);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetDatosProyectoForModal(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _proyectosRepo.GetDatosProyectoForModal(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }

        /// <summary>
        /// Agrupa los proyectos por gerencia
        /// y los cuenta, de acuerdo al año especificado
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countGroupByUnidad(int id)
        {
            try
            {
                int year = id;
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _proyectosRepo.countGroupByUnidad(year);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss)//Uso exclusivo para el modal de proyectos [el cual es generico]
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(ss.SubprogramasProyecto))
                {
                    //string subprogramas = ConfigurationManager.AppSettings["proyectosSubProgramas"];
                    //ss.ListaSubprogramas = subprogramas.Split(',').ToList<String>();
                    var subprogramas = ListaSubprogramasProyecto.subprogramas;
                    ss.ListaSubprogramas = subprogramas.Split(',').ToList<String>();
                }
                else
                {
                    ss.ListaSubprogramas = ss.SubprogramasProyecto.Split(',').ToList<String>();
                }

                var entities = await _proyectosRepo.getData(ss);

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

                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> busquedaProyectos([FromBody]DataServerSide ss)//Uso exclusivo para el modal de proyectos [el cual es generico]
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(ss.SubprogramasProyecto))
                {
                    //string subprogramas = ConfigurationManager.AppSettings["proyectosSubProgramas"];
                    //ss.ListaSubprogramas = subprogramas.Split(',').ToList<String>();
                    var subprogramas = ListaSubprogramasProyecto.subprogramas;
                    ss.ListaSubprogramas = subprogramas.Split(',').ToList<String>();
                }
                else
                {
                    ss.ListaSubprogramas = ss.SubprogramasProyecto.Split(',').ToList<String>();
                }

                var entities = await _proyectosRepo.busquedaProyectos(ss);

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

                log.Error(new MDCSet(this.ControllerContext.RouteData), e); // ex||error||e||etc|| new Exception("Custom description Error")
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countDistinctEmpresaOfProyecto(Boolean id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var cant = await _proyectosRepo.countDistinctEmpresaOfProyecto(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countClientesUnidades()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var cant = await _proyectosRepo.countClientesUnidades();//id es id empresa
                return Ok(cant);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        // GET: api/Proyectos
        [HttpPost]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campos = await _proyectosRepo.GetAll();
                return Ok(campos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //TODO: método de ejemplo v1
        [HttpPost]
        public async Task<IHttpActionResult> GetAllLikeNombreWithUnidad(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var proyectos = await _proyectosRepo.GetAllLikeNombre(id);
                UORepository uo = new UORepository();

                foreach (var p in proyectos)
                {
                    p.UnidadOrganizacional = await uo.GetById(p.UnidadOrganizacionalId);
                }
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //TODO: método de ejemplo v2 (speed)
        [HttpPost]
        public async Task<IHttpActionResult> GetAllLikeNombreWithUnidad2(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                IEnumerable<Proyecto> proyectos = await _proyectosRepo.GetAllLikeNombre(id);
                UORepository uo = new UORepository();
                List<Proyecto> listProy = new List<Proyecto>(proyectos);
                List<String> unidadesId = listProy.Select(x => x.UnidadOrganizacionalId).ToList();
                var unidades = await uo.GetAllByCollectionUnidadId(unidadesId);

                foreach (var p in proyectos)
                {
                    p.UnidadOrganizacional = unidades.Find(x => x.ClaveUnidad == p.UnidadOrganizacionalId);  //await uo.GetById(p.UnidadOrganizacionalId);
                }
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdFKs(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _proyectosRepo.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _proyectosRepo.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Proyecto proyecto)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _proyectosRepo.Create(proyecto);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        /*
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Proyecto proyecto)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _proyectosRepo.Update(proyecto);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }*/

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _proyectosRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetProyectos([FromBody]Proyecto Proyecto)
        {
            String id = null;
            String nombre = null;
            List<String> subprogramasList = new List<string>();
            if (Proyecto != null)
            {
                id = Proyecto.ProyectoId;
                nombre = Proyecto.Nombre;

                if (String.IsNullOrEmpty(Proyecto.subprogramasProyecto))
                {
                    //string subprogramas = ConfigurationManager.AppSettings["proyectosSubProgramas"];
                    //subprogramasList = subprogramas.Split(',').ToList<String>();
                    var subprogramas = ListaSubprogramasProyecto.subprogramas;
                    subprogramasList = subprogramas.Split(',').ToList<String>();
                }
                else
                {
                    subprogramasList = Proyecto.subprogramasProyecto.Split(',').ToList<String>();
                }

            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                var campo = await _proyectosRepo.GetProyectos(subprogramasList, id, nombre);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetProyectos(String id)
        {
            String likePalabra = id.ToString().ToLower();
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //string subprogramas = ConfigurationManager.AppSettings["proyectosSubProgramas"];
                //var subprogramasList = subprogramas.Split(',').ToList<String>();
                var subprogramas = ListaSubprogramasProyecto.subprogramas;
                var subprogramasList = subprogramas.Split(',').ToList<String>();
                var campo = await _proyectosRepo.GetProyectos(subprogramasList, likePalabra);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}