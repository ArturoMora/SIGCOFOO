using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Models.GI.util;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.WebAPI.Controllers.GENERICOS;
using INEEL.WebAPI.Utilidades.Data;
using log4net;

namespace INEEL.WebAPI.Controllers.GI
{
    public class ProductoGISolicitudController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(ProductoGISolicitudController));
        private ProductoGISolicitudRepository _repo;

        public ProductoGISolicitudController()
        {
            _repo = new ProductoGISolicitudRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> CountProductoGISolicitud()
        {
            try
            {
                var entities = await _repo.CountProductoGISolicitud();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllCompendio()
        {//id: clavePersona
            try
            {
                var entities = await _repo.GetAllCompendio();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFactoresInnovacion()
        {
            try
            {
                var entities = await _repo.GetFactoresInnovacion();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaCompendio(ProductoGI p)
        {
            try
            {
                var entities = await _repo.GetConsultaCompendio(p);
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetAllCompendio2()
        {//id: clavePersona
            try
            {
                var entities = await _repo.GetAllCompendio2();
                return Ok(entities);
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEvaluadorFI(String id)
        {//id: clavePersona
            try
            {
                var entities = await _repo.GetAllByEvaluadorFI(id);
                return Ok(entities);
            }
            catch (Exception e)
            {

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

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                var ProductoGISolicitud = await _repo.GetById(Id);
                return Ok(ProductoGISolicitud);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetByProductoId(int Id)
        {
            try
            {
                var ProductoGISolicitud = await _repo.GetByProductoId(Id);
                return Ok(ProductoGISolicitud);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> NotificarAsignacionEvalFI(MiembrosNotificar notificacion)
        {
            try
            {
                var _miembrosRepository = new MiembrosGERepository();
                var _PersonasRepository = new PersonasRepository();
                List<MiembrosGI> miembros = notificacion.ListaMiembros;
                int id = notificacion.Id;
                await _miembrosRepository.NotificarAsignacionEvalFI(miembros, id);
                Correo correo = new Correo();
                correo.Modulo = "Gestión de la Innovación";
                correo.Seccion = "Idea Innovadora";
                correo.TipoCorreo = "NotificacionEvaluadoresFI";

                var c = miembros.Select(x => x.ClavePersona);
                var lista = await _PersonasRepository.GetAllCollectionMAX(new HashSet<string>(c));
                var corrs = new HashSet<String>(lista.Select(x => x.Correo));
                correo.Descripcion1 = string.Join(", ", corrs.ToArray());
                var correoController = new CorreoController();
                try { 
                await correoController.SendNotificacion(correo);
                }
                catch (Exception err) { }
                return Ok("");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> Create([FromBody]ProductoGISolicitud model)
        {
      
            try
            {
                await _repo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]ProductoGISolicitud model)
        {
    

            try
            {
                await _repo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                await _repo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}
