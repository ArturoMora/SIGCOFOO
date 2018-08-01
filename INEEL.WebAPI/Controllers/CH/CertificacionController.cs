using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class CertificacionController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CertificacionController));
        CertificacionRepository _CertificacionRepo;

        public CertificacionController()
        {
            _CertificacionRepo = new CertificacionRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Certificacions = await _CertificacionRepo.GetAll();
                return Ok(Certificacions);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllCertificacion(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var Certificacions = await _CertificacionRepo.GetAllCertificacion(id);
                return Ok(Certificacions);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var Certificacions = await _CertificacionRepo.GetAllAdmin();
                return Ok(Certificacions);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var Certificacions = await _CertificacionRepo.GetById(id);
                return Ok(Certificacions);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Certificacion Certificacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CertificacionRepo.Create(Certificacion);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Certificacion Certificacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CertificacionRepo.Update(Certificacion);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Estado
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Certificacion Certificacion)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CertificacionRepo.UpdateEstado(Certificacion);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _CertificacionRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
