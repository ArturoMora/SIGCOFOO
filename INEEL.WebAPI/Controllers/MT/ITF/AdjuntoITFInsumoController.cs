/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using INEEL.DataAccess.MT.Models;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT.ITF
{
    public class AdjuntoITFInsumoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AdjuntoITFInsumoController));
        // AYUDA:
        //AdjuntoITFInsumoController.- Nombre de clase y tipicament constructor
        //AdjuntoITFInsumoRepository.- La implementación CRUD del Modelo:AdjuntoITFInsumo con el patrón de diseño Repository
        //_AdjuntoITFInsumoRepo.-      varible de tipo AdjuntoITFInsumoRepository
        // entities.-        resultado de tipo Task<IEnumerable<AdjuntoITFInsumo>>
        // AdjuntoITFInsumo.-         resultado de tipo Task<AdjuntoITFInsumo>
        // AdjuntoITFInsumo.-         Modelo
        private AdjuntoITFInsumoRepository _AdjuntoITFInsumoRepo;
        //private ProductsRepositories _productRepo;
        public AdjuntoITFInsumoController()
        {
            _AdjuntoITFInsumoRepo = new AdjuntoITFInsumoRepository();
            // _productRepo = new ProductsRepositories();
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _AdjuntoITFInsumoRepo.GetAll();
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
                var AdjuntoITFInsumo = await _AdjuntoITFInsumoRepo.Get(Id);
                return Ok(AdjuntoITFInsumo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]AdjuntoITFInsumo model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _AdjuntoITFInsumoRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]AdjuntoITFInsumo model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _AdjuntoITFInsumoRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _AdjuntoITFInsumoRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
