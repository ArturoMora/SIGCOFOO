using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    
    public class PaisController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(PaisController));
        //inicializar repositorio
        PaisRepository _paisesRepo;
        public PaisController()
        {
            _paisesRepo = new PaisRepository();
        }
        //obtener paises
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var paises = await _paisesRepo.GetAll();
                return Ok(paises);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var paises = await _paisesRepo.GetAllAdmin();
                return Ok(paises);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        //obtener paises
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEstado()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var paises = await _paisesRepo.GetAllByEstado();
                return Ok(paises);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        //Obtener pais especifico
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var pais = await _paisesRepo.GetById(id);
                return Ok(pais);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Agregar un pais
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create([FromBody]Pais pais)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _paisesRepo.Create(pais);
                return Ok("Registro creado exitosamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Actualizar Pais
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]Pais pais)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _paisesRepo.Update(pais);
                return Ok("Registro Actualizado Exitosamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Actualizar Pais
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado([FromBody]Pais pais)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _paisesRepo.UpdateEstado(pais);
                return Ok("Registro Actualizado Exitosamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Eliminar Pais
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _paisesRepo.Delete(id);
                return Ok("Registro Eliminado Exitosamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
