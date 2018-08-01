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
using INEEL.DataAccess.MT.Models.ITF.catalogos;

namespace INEEL.WebAPI.Controllers.MT.itf
{
    public class TipoAccesoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(TipoAccesoController));
        // AYUDA:
        //TipoAccesoController.- Nombre de clase y tipicament constructor
        //TipoAccesoRepository.- La implementación CRUD del Modelo:TipoAcceso con el patrón de diseño Repository
        //_entity|Repo.-      varible de tipo TipoAccesoRepository
        // entities.-        resultado de tipo Task<IEnumerable<TipoAcceso>>
        // entity.-         resultado de tipo Task<TipoAcceso>
        // TipoAcceso.-         Modelo
        private TipoAccesoRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public TipoAccesoController()
        {
            _entityRepo = new TipoAccesoRepository();
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
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]TipoAcceso model)
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
        public async Task<IHttpActionResult> Update([FromBody]TipoAcceso model)
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

       

    }
}
