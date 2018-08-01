/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.MT;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT
{
    public class SolicitudAccesoITFController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SolicitudAccesoITFController));
        // AYUDA:
        //SolicitudAccesoITFController1.- Nombre de clase y tipicament constructor
        //SolicitudAccesoITFRepository.- La implementación CRUD del Modelo:SolicitudAccesoITF con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo SolicitudAccesoITFRepository
        // entities.-        resultado de tipo Task<IEnumerable<SolicitudAccesoITF>>
        // entity.-         resultado de tipo Task<SolicitudAccesoITF>
        // SolicitudAccesoITF.-         Modelo
        private SolicitudAccesoITFRepository _db;
        //private ProductsRepositories _productRepo;
        public SolicitudAccesoITFController()
        {
            _db = new SolicitudAccesoITFRepository();
            // _productRepo = new ProductsRepositories();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAccesoITFByClaveUnidad(String id)
        {
            //id is ClaveUnidad
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _db.GetAccesoITFByClaveUnidad(id);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> AprobarAccesoITF(SolicitudAccesoITF solicitud)
        {
            //id is SolicitudAccesoITFId
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entitie = await _db.AprobarAccesoITF(solicitud.SolicitudAccesoITFId);
                await AddBitacora(solicitud, 10);
                return Ok(entitie);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> RechazoCondicionalAccesoITF(SolicitudAccesoITF solicitud)
        {
            //id is SolicitudAccesoITFId
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entitie = await _db.RechazoCondicionalAccesoITF(solicitud.SolicitudAccesoITFId);
                await AddBitacora(solicitud, 6);
                
                return Ok(entitie);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> DenegarAccesoITF(SolicitudAccesoITF solicitud)
        {
            //id is SolicitudAccesoITFId
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _db.DenegarAccesoITF(solicitud.SolicitudAccesoITFId);
                await AddBitacora(solicitud, 9);
                return Ok(solicitud);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        private async Task AddBitacora(SolicitudAccesoITF solicitud, int EstadoFlujoId)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                BitacoraSolicitudesRepository bitaReppo = new BitacoraSolicitudesRepository();
                BitacoraSolicitudes bita = new BitacoraSolicitudes();
                bita.SolicitudId = solicitud.SolicitudAccesoITFId;
                bita.FechaMovimiento = DateTime.Now;
                bita.ClavePersona = solicitud.ClavePersonaSolicitante; //??
                bita.Descripcion = solicitud.Justificacion;
                bita.EstadoFlujoId = EstadoFlujoId;
                bita.idRol = solicitud.idRol;

                await bitaReppo.Create(bita);

            }
            catch (Exception e1) { }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> GetAccesoITFByClaveEmpleado(String id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entities = await _db.GetAccesoITFByClaveEmpleado(id);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        public async Task<IHttpActionResult> GetAll()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _db.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _db.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        //[Authorize] public async Task<IHttpActionResult> Create([FromBody]SolicitudAccesoITF model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    try
        //    {
        //        await _db.Create(model);
        //        return Ok("Registro creado exitosamente!");
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]SolicitudAccesoITF model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _db.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _db.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
