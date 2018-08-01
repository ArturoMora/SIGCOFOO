/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.GEN.Repositories.MT;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using INEEL.DataAccess.GEN.Models.MT.ITF;

namespace INEEL.WebAPI.Controllers.MT.itf
{
    public class TipoInsumoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TipoInsumoController));
        // AYUDA:
        //TipoInsumoController.- Nombre de clase y tipicament constructor
        //TipoInsumoRepository.- La implementación CRUD del Modelo:TipoInsumo con el patrón de diseño Repository
        //_entity|Repo.-      varible de tipo TipoInsumoRepository
        // entities.-        resultado de tipo Task<IEnumerable<TipoInsumo>>
        // entity.-         resultado de tipo Task<TipoInsumo>
        // TipoInsumo.-         Modelo
        private TipoInsumoRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public TipoInsumoController()
        {
            _entityRepo = new TipoInsumoRepository();
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
        public async Task<IHttpActionResult> GetAllByEstadoDisponible()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAllByEstado(true);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]TipoInsumo model)
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
        public async Task<IHttpActionResult> Update([FromBody]TipoInsumo model)
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

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetInsumo(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entity = await _entityRepo.Get(id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado([FromBody]TipoInsumo model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(model);
                return Ok();
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


    }
}
