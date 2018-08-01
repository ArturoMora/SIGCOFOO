/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class ExtractoProfesionalController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ExtractoProfesionalController));
        // AYUDA:
        //ExtractoProfesionalController.- Nombre de clase y tipicament constructor
        //ExtractoProfesionalRepository.- La implementación CRUD del Modelo:ExtractoProfesional con el patrón de diseño Repository
        //_ExtractoProfesionalRepo.-      varible de tipo ExtractoProfesionalRepository
        // entities.-        resultado de tipo Task<IEnumerable<ExtractoProfesional>>
        // ExtractoProfesional.-         resultado de tipo Task<ExtractoProfesional>
        // ExtractoProfesional.-         Modelo
        private ExtractoProfesionalRepository _ExtractoProfesionalRepo;
        //private ProductsRepositories _productRepo;
        public ExtractoProfesionalController()
        {
            _ExtractoProfesionalRepo = new ExtractoProfesionalRepository();
            // _productRepo = new ProductsRepositories();
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _ExtractoProfesionalRepo.GetAll();
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
        public async Task<IHttpActionResult> GetByClave(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var ExtractoProfesional = await _ExtractoProfesionalRepo.Get(Id);
                return Ok(ExtractoProfesional);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]ExtractoProfesional model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ExtractoProfesionalRepo.Create(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]ExtractoProfesional model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _ExtractoProfesionalRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _ExtractoProfesionalRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
