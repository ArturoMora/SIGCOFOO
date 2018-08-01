/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.GEN.Repositories.MT;

namespace INEEL.WebAPI.Controllers.MT.ITF
{
    public class ResultadosEController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ResultadosEController));
        // AYUDA:
        //ResultadosEController.- Nombre de clase y tipicament constructor
        //ResultadosERepository.- La implementación CRUD del Modelo:ResultadosE con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo ResultadosERepository
        // entities.-        resultado de tipo Task<IEnumerable<ResultadosE>>
        // entity.-         resultado de tipo Task<ResultadosE>
        // ResultadosE.-         Modelo
        private ResultadosERepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public ResultadosEController()
        {
            _entityRepo = new ResultadosERepository();
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
        public async Task<IHttpActionResult> Get(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]ResultadosE model)
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
        public async Task<IHttpActionResult> Update([FromBody]ResultadosE model)
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


    }
}
