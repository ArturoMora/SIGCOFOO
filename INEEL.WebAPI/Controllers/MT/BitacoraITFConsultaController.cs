/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using INEEL.WebAPI.Utilidades;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT
{
    public class BitacoraITFConsultaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BitacoraITFConsultaController));

        private BitacoraITFConsultaRepository _entityRepo;
        
        public BitacoraITFConsultaController()
        {
            _entityRepo = new BitacoraITFConsultaRepository();
            
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
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]BitacoraITFConsulta model)
        {
            if (model==null ||
                String.IsNullOrEmpty(model.InformeTecnicoFinalId) || String.IsNullOrEmpty(model.ClavePersona) )
            {
                return BadRequest(ModelState);
            }
            model.FechaMovimiento = DateTime.Now;
            model.Ip = "indefinida";
            ServerVariables sv = new ServerVariables();
            var datos= await sv.GetIPasync();
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                model.Ip = String.IsNullOrEmpty(datos.RemoteAddr) ? datos.ClientIP : datos.RemoteAddr;
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]BitacoraITFConsulta model)
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
