using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.CH
{
    public class IdiomasController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(IdiomasController));
        IdiomasRepository _idiomasRepo;
        AdjuntoRepository _adjuntoRepo;

        public IdiomasController()
        {
            _idiomasRepo = new IdiomasRepository();
            _adjuntoRepo = new AdjuntoRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var idiomas = await _idiomasRepo.GetAll();
                return Ok(idiomas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpleado(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var claveempleado = id;
                var idiomas = await _idiomasRepo.GetByClaveEmpleado(claveempleado);
                return Ok(idiomas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var idiomas = await _idiomasRepo.GetById(id);
                return Ok(idiomas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Idiomas idioma)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _idiomasRepo.Create(idioma);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Idiomas idioma)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                
                //solución de ALAN replicada
                //if (idioma.Adjunto != null)
                //    idioma.AdjuntoId = idioma.Adjunto.AdjuntoId;
                await _idiomasRepo.Update(idioma);
                return Ok(idioma);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateSolicitud(Idiomas idioma)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _idiomasRepo.UpdateSolicitud(idioma);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _idiomasRepo.Delete(id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Idiomas Idiomas)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _idiomasRepo.UpdateEstado(Idiomas);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
