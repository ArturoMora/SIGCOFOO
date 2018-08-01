﻿using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class SitioWebFondoProgramaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(SitioWebFondoProgramaController));
        // AYUDA:
        //SitioWebFondoProgramaController.- Nombre de clase y tipicament constructor
        //SitioWebFondoProgramaRepository.- La implementación CRUD del Modelo:SitioWebFondoPrograma con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo SitioWebFondoProgramaRepository
        // entities.-        resultado de tipo Task<IEnumerable<SitioWebFondoPrograma>>
        // entity.-         resultado de tipo Task<SitioWebFondoPrograma>
        // SitioWebFondoPrograma.-         Modelo
        private SitioWebFondoProgramaRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public SitioWebFondoProgramaController()
        {
            _entityRepo = new SitioWebFondoProgramaRepository();
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
        [Authorize] public async Task<IHttpActionResult> Create(SitioWebFondoPrograma model)
        {


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                var result = await _entityRepo.Create(model);
                return Ok(result);



            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                if (e.Message.Substring(0, 44) == "An error occurred while updating the entries")
                {
                    return BadRequest("Ya existe un registro con ese nombre");
                }
                return InternalServerError(e);
            }

            
 
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]SitioWebFondoPrograma model)
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
        public async Task<IHttpActionResult> UpdateEstado([FromBody]SitioWebFondoPrograma model)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(model);
                return Ok();
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