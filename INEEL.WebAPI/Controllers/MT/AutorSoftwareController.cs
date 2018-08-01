/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.MT;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT
{
    public class AutorSoftwareController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AutorSoftwareController));
        // AYUDA:
        //AutorSoftwareController.- Nombre de clase y tipicament constructor
        //AutorSoftwareRepository.- La implementación CRUD del Modelo:AutorSoftware con el patrón de diseño Repository
        //_AutorSoftwareRepo.-      varible de tipo AutorSoftwareRepository
        // entities.-        resultado de tipo Task<IEnumerable<AutorSoftware>>
        // AutorSoftware.-         resultado de tipo Task<AutorSoftware>
        // AutorSoftware.-         Modelo
        private AutorSoftwareRepository _AutorSoftwareRepo;
        //private ProductsRepositories _productRepo;
        public AutorSoftwareController()
        {
            _AutorSoftwareRepo = new AutorSoftwareRepository();
            // _productRepo = new ProductsRepositories();
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _AutorSoftwareRepo.GetAll();
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
                var AutorSoftware = await _AutorSoftwareRepo.Get(Id);
                return Ok(AutorSoftware);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpleado(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var AutorSoftware = await _AutorSoftwareRepo.GetByClaveEmpleado(Id);
                return Ok(AutorSoftware);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]AutorSoftware model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _AutorSoftwareRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //[Authorize][HttpPut]
        //public async Task<IHttpActionResult> Update([FromBody]AutorSoftware model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    try
        //    {
        //        await _AutorSoftwareRepo.Update(model);
        //        return Ok("Registro actualizado exitosamente!");
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _AutorSoftwareRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
