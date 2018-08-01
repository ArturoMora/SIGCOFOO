using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;

namespace INEEL.WebAPI.Controllers.MT
{
    public class CursosPersonalController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CursosPersonalController));
        CursosPersonalRepository _CursosPersonalRepo;
        AutoresCursoRepository _autoRepo;
        TipoCursoRepository _tipocurso;

        public CursosPersonalController()
        {
            _tipocurso = new TipoCursoRepository();
            _autoRepo = new AutoresCursoRepository();
            _CursosPersonalRepo = new CursosPersonalRepository();
        }
        //Obtener todos los ambitos
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var CursosPersonal = await _CursosPersonalRepo.GetAll();
                return Ok(CursosPersonal);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }

        }

        [Route("api/CursosPersonal/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string clave)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _CursosPersonalRepo.GetByClave(clave);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //Obtener un ambito por id
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var CursosPersonal = await _CursosPersonalRepo.GetById(id);
                return Ok(CursosPersonal);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Crear CursosPersonal
        
        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]CursosPersonal CursosPersonal)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CursosPersonalRepo.Create(CursosPersonal);
                return Ok("Registro creado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar CursosPersonal
        
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]CursosPersonal CursosPersonal)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CursosPersonalRepo.Update(CursosPersonal);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Estado
        
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado([FromBody]CursosPersonal CursosPersonal)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CursosPersonalRepo.UpdateEstado(CursosPersonal);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar CursosPersonal
        
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _CursosPersonalRepo.Delete(id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        //eliminar  DeleteAdjuntoCursosPersonal
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> DeleteAdjuntoCursosPersonal(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _CursosPersonalRepo.DeleteAdjuntoCursosPersonal(id);
                return Ok("Adjunto eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        //eliminar  Autor
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> DeleteAutorCursosPersonal(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _CursosPersonalRepo.DeleteAutorCursosPersonal(id);
                return Ok("Autor eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
