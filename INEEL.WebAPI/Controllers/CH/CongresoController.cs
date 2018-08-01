using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.Web.UI;

namespace INEEL.WebAPI.Controllers.CH
{
    public class CongresoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(CongresoController));
        CongresoRepository _CongresoRepo;

        public CongresoController()
        {
            _CongresoRepo = new CongresoRepository();
        }

        //Obtener todos los congresos
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Congresos = await _CongresoRepo.GetAll();
                return Ok(Congresos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var Congresos = await _CongresoRepo.GetAllAdmin();
                return Ok(Congresos);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        //Obtener "todos" los congresos con serverSide by ACH
        [AllowAnonymous]
        [HttpPost] public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss){try {
                var x111 = HttpContext.Current.Request;

                /*var draw = HttpContext.Current.Request.Form["draw"];
                var draw2 = HttpContext.Current.Request.Form["nameColumns"];*/
                var draw2 = HttpContext.Current.Request.Form["search[value]"];
                
                //DataServerSide ss = new DataServerSide(HttpContext.Current.Request, parameters);                
                var entities= await _CongresoRepo.getData(ss);

                //return Json(new {
                //    draw = ss.draw,
                //    recordsFiltered = ss.recordsTotal,
                //    recordsTotal = ss.recordsTotal,
                //    data = entities
                //}
                //);
                //var Congresos = await _CongresoRepo.GetAll();

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };
                
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Obtenercongreso por id
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetbyId(int id){ try {
                var Congreso = await _CongresoRepo.GetById(id);
                return Ok(Congreso);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //crear congreso
        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(Congreso Congreso)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CongresoRepo.Create(Congreso);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        //Actualizar congreso
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Congreso Congreso)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CongresoRepo.Update(Congreso);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar congreso
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Congreso Congreso)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _CongresoRepo.UpdateEstado(Congreso);
                return Ok();
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar Congreso
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _CongresoRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
