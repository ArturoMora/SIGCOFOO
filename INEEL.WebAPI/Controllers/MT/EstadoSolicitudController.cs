/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT
{
    public class EstadoSolicitudController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EstadoSolicitudController));
        // AYUDA:
        //EstadoSolicitudRepositoryController.- Nombre de clase y tipicament constructor
        //EstadoSolicitudRepository.- La implementación CRUD del Modelo:EstadoSolicitud con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo EstadoSolicitudRepository
        // entities.-        resultado de tipo Task<IEnumerable<EstadoSolicitud>>
        // entity.-         resultado de tipo Task<EstadoSolicitud>
        // EstadoSolicitud.-         Modelo

        private EstadoSolicitudRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public EstadoSolicitudController()
        {
            _entityRepo = new EstadoSolicitudRepository();
            // _productRepo = new ProductsRepositories();
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _entityRepo.GetAll();
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
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]EstadoSolicitud model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]EstadoSolicitud model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(EstadoSolicitud model)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
