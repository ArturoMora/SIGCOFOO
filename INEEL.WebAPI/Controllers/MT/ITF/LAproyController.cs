/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.MT.ITF
{
    public class LAproyController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(LAproyController));
        // AYUDA:
        //LAproyController.- Nombre de clase y tipicament constructor
        //LAproyRepository.- La implementación CRUD del Modelo:LAproy con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo LAproyRepository
        // entities.-        resultado de tipo Task<IEnumerable<LAproy>>
        // entity.-         resultado de tipo Task<LAproy>
        // LAproy.-         Modelo
        private LAproyRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public LAproyController()
        {
            _entityRepo = new LAproyRepository();
            // _productRepo = new ProductsRepositories();
        }
        [AllowAnonymous]
        [HttpGet]	public async Task<IHttpActionResult> countByStatus(int id){	try {
                var cant = await _entityRepo.countByStatus(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }         
        [HttpPost]
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss, int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));//id is EstadoITFFlujoId
                var entities = await _entityRepo.getData(ss,id);

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
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
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]LAproy model)
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
        public async Task<IHttpActionResult> Update([FromBody]LAproy model)
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
        public async Task<IHttpActionResult> GetWord(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entity = await _entityRepo.GetWord(id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

    }
}
